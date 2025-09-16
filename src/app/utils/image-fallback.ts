    import { Directive, HostListener, Input, ElementRef, inject } from '@angular/core';

    @Directive({
      selector: 'img[appImgFallback]',
      standalone: true
    })
    export class AppImgFallbackDirective {
        @Input() appImgFallback: string | undefined;
        readonly el = inject(ElementRef);

        @HostListener('error')
        onError() {
            if (this.appImgFallback) {
                this.el.nativeElement.src = this.appImgFallback;
                this.el.nativeElement.style.visibility = 'visible';
            }
            else
                this.el.nativeElement.style.visibility = 'hidden';
        }
    }