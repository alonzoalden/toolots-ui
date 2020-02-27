import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { FileManagerService } from 'app/main/file-manager/file-manager.service';
import { FileManagerComponent } from 'app/main/file-manager/file-manager.component';
import { FileManagerDetailsSidebarComponent } from 'app/main/file-manager/sidebars/details/details.component';
import { FileManagerFileListComponent } from 'app/main/file-manager/file-list/file-list.component';
import { FileManagerMainSidebarComponent } from 'app/main/file-manager/sidebars/main/main.component';
import { MailComposeDialogComponent } from 'app/main/file-manager/dialogs/compose.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
const routes: Routes = [
    {
        path: 'file-manager',
        component: FileManagerComponent,
        children: [],
        resolve: {
            files: FileManagerService
        }
    }
];

@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerFileListComponent,
        FileManagerMainSidebarComponent,
        FileManagerDetailsSidebarComponent,
        MailComposeDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatIconModule,
        MatRippleModule,
        MatSlideToggleModule,
        MatTableModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatSelectModule,
        MatToolbarModule,
        FuseSharedModule,
        FuseSidebarModule
    ],
    providers: [
        FileManagerService
    ],
    entryComponents: [
        MailComposeDialogComponent
    ]
})
export class FileManagerModule {
}
