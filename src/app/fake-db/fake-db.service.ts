import { InMemoryDbService } from 'angular-in-memory-web-api';
import { FileManagerFakeDb } from 'app/fake-db/file-manager';
import { AcademyFakeDb } from './academy';

export class FakeDbService implements InMemoryDbService
{
    createDb(): any
    {
        return {
            // File Manager
            'file-manager': FileManagerFakeDb.files,
            'academy-categories': AcademyFakeDb.categories,
            'academy-courses'   : AcademyFakeDb.courses,
            'academy-course'    : AcademyFakeDb.course,
        };
    }
}
