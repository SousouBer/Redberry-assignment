import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({
  standalone: true,
  selector: 'dragAndDrop'
})
export class dragAndDropDirective {
  // @Output() fileDropped = new EventEmitter<FileList>();


  @HostListener('dragover', ['$event']) onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
  }

  @HostListener('drop', ['$event']) onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer?.files;
    if (files) {
      // this.fileDropped.emit(files);
      console.log(files);
    }
  }
}