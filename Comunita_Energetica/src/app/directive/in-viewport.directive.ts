import {Directive, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[appInViewport]'
})

export class InViewportDirective {

    @Output() public appInViewport: EventEmitter<any> = new EventEmitter();
    @Input() public inViewportOptions!: string;
    @Input() public className: string = '';
    private _intersectionObserver!: IntersectionObserver;
  
    constructor(
        private renderer: Renderer2,
        private _element: ElementRef
    ) {}
  
    public ngAfterViewInit() {
        this._intersectionObserver = new IntersectionObserver(entries => {
            this.checkForIntersection(entries);
        }, (this.inViewportOptions ? JSON.parse(this.inViewportOptions) : {}));
        this._intersectionObserver.observe((this._element.nativeElement) as Element);
    }
  
    private checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (this.checkIfIntersecting(entry)) {
                this.appInViewport.emit({target: this._element});
                // this._intersectionObserver.unobserve((this._element.nativeElement) as Element);
                // this._intersectionObserver.disconnect();
            }
        });
    }
  
    private checkIfIntersecting(entry: IntersectionObserverEntry) {
        if (entry.isIntersecting) {
            if (this.className !== '') {
                this.renderer.addClass(entry.target, this.className);
            }
        } else {
            if (this.className !== '') {
                this.renderer.removeClass(entry.target, this.className);
            }
        }
        return (entry as any).isIntersecting && entry.target === this._element.nativeElement;
    }
}
