import { AfterViewInit, Component, ContentChild, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import gsap, { Power4, Elastic } from 'gsap';

@Component({
  selector: 'magnetic',
  templateUrl: './magnetic.component.html',
  styleUrls: ['./magnetic.component.css']
})

export class MagneticComponent implements OnInit, AfterViewInit {
    @ContentChild('content', { static: true }) contentRef!: ElementRef;
    @ViewChild('magnetoRef', {read: ElementRef}) magnetoHas!: ElementRef;
    @Input() magnetoId: string = '';
    content: string = '';

    ngAfterViewInit(): void {
        console.log(this.magnetoHas.nativeElement.value);
    }

    ngOnInit(): void {
        this.moveButton();
    }
    
    moveButton = () => {
        // Get magneto
        // const magnetoList: NodeListOf<HTMLElement> | null = document.querySelectorAll('.magneto');
        const magneto: HTMLElement | null = document.getElementById(this.magnetoId);
        console.log(this.magnetoId);
        // const magnetoText: HTMLElement = this.contentRef.nativeElement;
        
        // magnetoList.forEach(magneto => {
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
                
                
                // gsap.to(magnetoText!, {
                //     duration: 1,
                //     x: newX * magnetoTextStrength,
                //     y: newY * magnetoTextStrength,
                //     ease: Power4.easeOut
                // });
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
            
                // gsap.to(magnetoText!, {
                //     duration: 1,
                //     x: 0,
                //     y: 0,
                //     ease: Elastic.easeOut
                // });
            };
            
            // Add event listeners
            magneto?.addEventListener('mousemove', activateMagneto);
            magneto?.addEventListener('mouseleave', resetMagneto);
        // });
    };
}
function Content(arg0: string, arg1: { static: boolean; }) {
    throw new Error('Function not implemented.');
}

