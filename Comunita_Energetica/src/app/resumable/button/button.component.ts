import { Component, ContentChild, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'hover-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})

export class ButtonComponent implements OnInit {
    @ContentChild('content', { static: true }) content!: ElementRef;
    @ViewChild('hoverElement', { static: true }) hoverRef!: ElementRef;
    @Input() className: string = '';

    timeline!: gsap.core.Timeline;
    timeoutId = setTimeout(() => {}, 300);

    ngOnInit(): void {
        this.moveHover();
    }

    moveHover = () => {
        this.timeline = gsap.timeline({paused:true});
        this.timeline
        .to(this.hoverRef.nativeElement, {top: "-25%", width: "150%", duration: 0.4, ease: "power3.in"}, "enter")
        .to(this.hoverRef.nativeElement, {top: "-150%", width: "125%", duration: 0.25}, "exit");
    }
    
    activateHover = () => {
        if(this.timeoutId) clearTimeout(this.timeoutId)
        this.timeline.tweenFromTo('enter', 'exit');
    };
    
    resetHover = () => {
        this.timeoutId = setTimeout(() => {
            this.timeline.play();
        }, 300)
    };
}
