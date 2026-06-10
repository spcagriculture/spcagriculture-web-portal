/**
 * One-time migration: copy legacy top-level Firestore collections into
 * departments/{deptId}/{collection}/{docId}.
 *
 * Usage (requires Firebase Admin credentials):
 *   GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json node scripts/migrate-to-departments.mjs
 *
 * Or with Firebase CLI application default credentials after `firebase login`.
 */
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DEPARTMENT_IDS = ['agriculture', 'land', 'animal', 'fisheries', 'irrigation'];

const COLLECTIONS_WITH_DEPT_FIELD = [
  'videos',
  'projects',
  'officers',
  'vacancies',
  'documents',
];

const COLLECTIONS_GLOBAL = [
  'services',
  'news',
  'notices',
  'publications',
  'galleryEvents',
  'circulars',
  'exams',
  'exam_results',
];

function resolveDepartment(data, collectionName) {
  const dept = data?.department;
  if (typeof dept === 'string' && DEPARTMENT_IDS.includes(dept)) {
    return dept;
  }
  if (COLLECTIONS_WITH_DEPT_FIELD.includes(collectionName)) {
    return 'agriculture';
  }
  return 'agriculture';
}

function stripDepartmentField(data, collectionName) {
  if (!COLLECTIONS_WITH_DEPT_FIELD.includes(collectionName)) return data;
  const { department, ...rest } = data;
  return rest;
}

async function migrateCollection(db, collectionName) {
  const snap = await db.collection(collectionName).get();
  if (snap.empty) {
    console.log(`  ${collectionName}: no documents`);
    return;
  }

  let count = 0;
  const batchSize = 400;
  let batch = db.batch();
  let batchCount = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const deptId = resolveDepartment(data, collectionName);
    const targetRef = db
      .collection('departments')
      .doc(deptId)
      .collection(collectionName)
      .doc(docSnap.id);

    batch.set(targetRef, stripDepartmentField(data, collectionName));
    count++;
    batchCount++;

    if (batchCount >= batchSize) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) await batch.commit();
  console.log(`  ${collectionName}: migrated ${count} documents`);
}

async function migrateStatistics(db) {
  for (const deptId of DEPARTMENT_IDS) {
    const legacyRef = db.collection('department_statistics').doc(deptId);
    const legacySnap = await legacyRef.get();
    if (!legacySnap.exists) continue;

    const targetRef = db
      .collection('departments')
      .doc(deptId)
      .collection('statistics')
      .doc('main');

    await targetRef.set(legacySnap.data());
    console.log(`  statistics: migrated ${deptId}`);
  }
}

async function main() {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'spc-web-portal';

  try {
    initializeApp({
      credential: applicationDefault(),
      projectId,
    });
  } catch {
    console.error(
      'Failed to initialize Firebase Admin. Set GOOGLE_APPLICATION_CREDENTIALS or run firebase login.'
    );
    process.exit(1);
  }

  const db = getFirestore();
  console.log('Migrating legacy collections to departments/...');

  for (const name of [...COLLECTIONS_GLOBAL, ...COLLECTIONS_WITH_DEPT_FIELD]) {
    await migrateCollection(db, name);
  }

  await migrateStatistics(db);
  console.log('Migration complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
