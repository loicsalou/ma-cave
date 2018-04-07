export class FileItem {

  public file: Blob;
  public url: string = '';
  public isUploading: boolean = false;
  public progress: number = 0;

  public constructor(file: Blob) {
    this.file = file;
  }

}
