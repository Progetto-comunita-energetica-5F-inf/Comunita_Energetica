import { Component, OnInit } from '@angular/core';
import gsap, { Power4, Elastic } from 'gsap';
import { ButtonComponent } from '../resumable/button/button.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit {
    timeline!: gsap.core.Timeline;
    timeoutId = setTimeout(() => {}, 300);

    ngOnInit(): void {
        this.moveText();
        this.moveHover();
    }

    moveHover = () => {
        const hoverBtn: HTMLElement | null = document.querySelector('.hover-circle');
        
        this.timeline = gsap.timeline({paused:true});
        this.timeline
        .to(hoverBtn, {top: "-100%", width: "150%", translateX: "-17.5%", duration: 0.4, ease: "power3.in"}, "enter")
        .to(hoverBtn, {top: "-300%", width: "125%", translateX: "-10%", duration: 0.25}, "exit");
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
    
    moveText = () => {
        // Get magneto
        const magnetoList: NodeListOf<HTMLElement> | null = document.querySelectorAll('.magneto-text');
        const magnetoDict: { [id: string] : boolean; } = {};
        
        // Mouse move stuff
        const activateMagneto = (event: MouseEvent) => {
            magnetoList.forEach(magneto => {
                let boundBox = magneto?.getBoundingClientRect(); // Gets position on the page along with the width and height
                const magnetoStrength: number = 50;
                const newX: number = ((event.clientX - boundBox!.left) / magneto!.offsetWidth) - 0.5;
                const newY: number = ((event.clientY - boundBox!.top) / magneto!.offsetHeight) - 0.5;

                magneto?.addEventListener('mouseover', () => { magnetoDict[magneto.id] = true; });
                magneto?.addEventListener('mouseout', () => { magnetoDict[magneto.id] = false; });
                
                // Move the button to his new position
                if (magnetoDict[magneto.id]) {
                    gsap.to(magneto!, {
                        duration: 1,
                        x: newX * magnetoStrength,
                        y: newY * magnetoStrength,
                        ease: Power4.easeOut
                    });
                }
            });
        };

        // Mouse leave stuff
        const resetMagneto = (event: MouseEvent) => {
            magnetoList.forEach(magneto => {
                magneto?.addEventListener('mouseover', () => { magnetoDict[magneto.id] = true; });
                magneto?.addEventListener('mouseout', () => { magnetoDict[magneto.id] = false; });

                // Move the button to his default position
                if (!magnetoDict[magneto.id]) {
                    gsap.to(magneto!, {
                        duration: 1,
                        x: 0,
                        y: 0,
                        ease: Elastic.easeOut
                    });
                }
            });
        };
        
        // Add event listeners
        magnetoList.forEach(magneto => {
            magneto?.addEventListener('mousemove', activateMagneto);
            magneto?.addEventListener('mouseleave', resetMagneto);
        });
    };
}
