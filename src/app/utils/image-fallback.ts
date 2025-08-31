    import { Directive, HostListener, Input, ElementRef, inject } from '@angular/core';

    @Directive({
      selector: 'img[imgFallback]',
      standalone: true
    })
    export class ImgFallbackDirective {
        @Input() imgFallback: string | undefined;
        readonly el = inject(ElementRef);

        @HostListener('error')
        onError() {
            if (this.imgFallback) {
                this.el.nativeElement.src = this.imgFallback;
                this.el.nativeElement.style.visibility = 'visible';
            }
            else
                this.el.nativeElement.style.visibility = 'hidden';
        }
    }