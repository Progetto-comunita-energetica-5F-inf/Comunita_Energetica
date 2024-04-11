import { Component, OnInit } from '@angular/core';
import gsap, { Power4, Elastic } from 'gsap';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit {

    constructor() {}
    
    moveHeaderButton = () => {
        // Get magneto
        const magneto: HTMLElement | null = document.querySelector('.magneto');
        const magnetoText: HTMLElement | null = document.querySelector('.magneto .text');
        
        // Mouse move stuff
        const activateMagneto = (event: MouseEvent) => {
            let boundBox = magneto?.getBoundingClientRect(); // Gets position on the page along with the width and height
            const magnetoStrength: number = 50;
            const magnetoTextStrength: number = 100;
            const newX: number = ((event.clientX - boundBox!.left) / magneto!.offsetWidth) - 0.5;
            const newY: number = ((event.clientY - boundBox!.top) / magneto!.offsetHeight) - 0.5;

            // Move the button to his new position
            gsap.to(magneto!, {
            duration: 1,
            x: newX * magnetoStrength,
            y: newY * magnetoStrength,
            ease: Power4.easeOut
        });

        gsap.to(magnetoText!, {
            duration: 1,
            x: newX * magnetoTextStrength,
            y: newY * magnetoTextStrength,
            ease: Power4.easeOut
        });
    };

        // Mouse leave stuff
        const resetMagneto = (event: MouseEvent) => {
            // Move the button to his default position
            gsap.to(magneto!, {
            duration: 1,
            x: 0,
            y: 0,
            ease: Elastic.easeOut
            });
            
            gsap.to(magnetoText!, {
                duration: 1,
            x: 0,
            y: 0,
            ease: Elastic.easeOut
        });
        };
        
        // Add event listeners
        magneto?.addEventListener('mousemove', activateMagneto);
        magneto?.addEventListener('mouseleave', resetMagneto);
    };
    
    ngOnInit(): void {
        this.moveHeaderButton();
    }
}
