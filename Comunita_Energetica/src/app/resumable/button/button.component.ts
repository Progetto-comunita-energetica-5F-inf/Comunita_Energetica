import { Component, ContentChild, ElementRef, OnInit, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'hover-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})

export class ButtonComponent implements OnInit {
    @ContentChild('content', { static: true }) content!: ElementRef;
    @ViewChild('hoverElement', { static: true }) hoverRef!: ElementRef;

    timeline!: gsap.core.Timeline;
    timeoutId = setTimeout(() => {}, 300);

    ngOnInit(): void {
        this.moveHover();
    }

    moveHover = () => {
        this.timeline = gsap.timeline({paused:true});
        this.timeline
        .to(this.hoverRef.nativeElement, {top: "-100%", width: "150%", translateX: "-17.5%", duration: 0.4, ease: "power3.in"}, "enter")
        .to(this.hoverRef.nativeElement, {top: "-300%", width: "125%", translateX: "-10%", duration: 0.25}, "exit");
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
