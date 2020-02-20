import { InMemoryDbService } from 'angular-in-memory-web-api';
import { FileManagerFakeDb } from 'app/fake-db/file-manager';

export class FakeDbService implements InMemoryDbService
{
    createDb(): any
    {
        return {
            // File Manager
            'file-manager': FileManagerFakeDb.files,
        };
    }
}
