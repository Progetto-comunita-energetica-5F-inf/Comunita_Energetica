import { Component, ContentChild, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import gsap, { Power4, Elastic } from 'gsap';

@Component({
  selector: 'magnetic',
  templateUrl: './magnetic.component.html',
  styleUrls: ['./magnetic.component.css']
})

export class MagneticComponent implements OnInit {
    @Input() content!: ElementRef;
    @ViewChild('magneto', { static: true }) magneto!: ElementRef;

    ngOnInit(): void {
        this.moveButton();
    }

    moveButton = () => {
        const activateMagneto = (event: MouseEvent) => {
            let boundBox = this.magneto.nativeElement.getBoundingClientRect(); // Gets position on the page along with the width and height
            let magnetoStrength: number = 0;
            let magnetoTextStrength: number = 0;

            if (this.magneto.nativeElement.height > 70) {
                magnetoStrength = 50;
                magnetoTextStrength = 100;
            } else {
                magnetoStrength = 30;
                magnetoTextStrength = 20;
            };
            
            const newX: number = ((event.clientX - boundBox!.left) / this.magneto.nativeElement.offsetWidth) - 0.5;
            const newY: number = ((event.clientY - boundBox!.top) / this.magneto.nativeElement.offsetHeight) - 0.5;
                
            // Move the button to his new position
            gsap.to(this.magneto.nativeElement, {
                duration: 1,
                x: newX * magnetoStrength,
                y: newY * magnetoStrength,
                ease: Power4.easeOut
            });
            
            
            gsap.to(this.content.nativeElement, {
                duration: 1,
                x: newX * magnetoTextStrength,
                y: newY * magnetoTextStrength,
                ease: Power4.easeOut
            });
        };

        // Mouse leave stuff
        const resetMagneto = (event: MouseEvent) => {
            // Move the button to his default position
            gsap.to(this.magneto.nativeElement, {
                duration: 1,
                x: 0,
                y: 0,
                ease: Elastic.easeOut
            });
        
            gsap.to(this.content.nativeElement, {
                duration: 1,
                x: 0,
                y: 0,
                ease: Elastic.easeOut
            });
        };
        
        // Add event listeners
        this.magneto.nativeElement.addEventListener('mousemove', activateMagneto);
        this.magneto.nativeElement.addEventListener('mouseleave', resetMagneto);
    };
}

