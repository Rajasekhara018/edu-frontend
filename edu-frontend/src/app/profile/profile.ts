import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropDialog } from '../dashboard/image-crop-dialog/image-crop-dialog';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../shared/model';
import { APIPath } from '../shared/api-enum';
import { PayeaseRestservice } from '../shared/services/payease-restservice';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  constructor(private dialog:MatDialog, private http:HttpClient, private postService:PayeaseRestservice){}
  customerObj = new Customer();
  checkType!: boolean;
  checkSize!: boolean;
  imageRequiredMessage!: string;
  imageChangedEvent!: any;
  type!: any;
  invalidSizeMessage!: string;
  invalidTypeMessage!: string;
  finalImage!: any;
  fileName!: any;
  private imageModal: any;
  @ViewChild('imageModal') imageModalRef!: ElementRef;
  croppedImage!: string;
  fileChangeEvent(event: any) {
    this.imageRequiredMessage = "";
    this.imageChangedEvent = event;
    let size = 0;
    if (this.imageChangedEvent.target.files['0'] != undefined) {
      size = this.imageChangedEvent.target.files['0'].size;
      this.type = this.imageChangedEvent.target.files['0'].type;
    }
    size = Math.round((size / 1024));
    if (size > 2000) {
      this.checkSize = true;
      this.checkType = false;
      this.invalidSizeMessage = "Image size must be less than 2MB";
    }
    else {
      this.checkSize = false;
    }
    if (this.type == 'image/gif' || this.type == 'image/jpeg' || this.type == 'image/jpg' || this.type == 'image/png') {
      this.checkType = false;
    }
    else {
      this.checkType = true;
      this.invalidTypeMessage = "Allowed file type(s) are- .JPG, .PNG, .GIF";
    }
    if (!this.checkSize && !this.checkType) {
      let file = event.target.files[0];
      this.finalImage = event.target.files[0];
      this.fileName = file.name;
      if (this.finalImage) {
        this.openCropDialog(event);
      }
    }
  }
  cancelImage(): void {
    this.imageChangedEvent = '';
    this.croppedImage = '';
    if (this.imageModal) this.imageModal.hide();
  }
  openCropDialog(event: any) {
    const dialogRef = this.dialog.open(ImageCropDialog, {
      width: '600px',
      data: { imageChangedEvent: event }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.croppedImage = result.croppedImage;
        // Use the cropped image (base64 string)
        this.confirmFileUpload(result.finalImage);
      }
    });
  }
  confirmFileUpload(ImageData: any) {
    const formData = new FormData();
    // Append the file
    formData.append('file', ImageData);
    // Append metadata fields
    formData.append('filename', 'PROFILE_IMAGE');
    // formData.append('fileType', ImageData.type);
    // formData.append('title', metadata.title ?? '');
    formData.append('prefixFolder', "PROFILE");
    // formData.append('size', ImageData.size.toString());
    let apiUrl = this.postService.getBaseUrl() + APIPath.FILE_UPLOAD;
    return this.http.post(apiUrl, formData).subscribe((res: any) => {
      // this.customerObj.image = res.object;
    }, (error) => {
      console.log(error);
    });
  }

}
