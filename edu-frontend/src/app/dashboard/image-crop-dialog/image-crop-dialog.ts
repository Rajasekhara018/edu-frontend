import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-image-crop-dialog',
  standalone: false,
  templateUrl: './image-crop-dialog.html',
  styleUrl: './image-crop-dialog.scss'
})
export class ImageCropDialog {
croppedImage: string = '';
  constructor(
    public dialogRef: MatDialogRef<ImageCropDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imageCropped(data.imageChangedEvent)
  }

  async imageCropped(event: ImageCroppedEvent) {
    debugger
    if (!event.objectUrl) {
      console.error('objectUrl is null or undefined');
      return;
    }

    try {
      const blob = await this.getObjectUrlAsBlob(event.objectUrl);
      const base64DataUrl = await this.blobToDataUrl(blob);
      this.croppedImage = base64DataUrl;

      const contentType = base64DataUrl.split(';')[0].split(':')[1];
      const fileBlob = await fetch(base64DataUrl).then(res => res.blob());
      const file = new File([fileBlob], this.data.fileName, { type: contentType });

      this.data.finalImage = file;
      this.data.croppedImage = base64DataUrl;
    } catch (err) {
      console.error('Error processing cropped image:', err);
    }
  }

  blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async getObjectUrlAsBlob(objectUrl: string): Promise<Blob> {
    const response = await fetch(objectUrl);
    return response.blob();
  }

  onSave() {
    this.dialogRef.close(this.data); // Return final file
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
