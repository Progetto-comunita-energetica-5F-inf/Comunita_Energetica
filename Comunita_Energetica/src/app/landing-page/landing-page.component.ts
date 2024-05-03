import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Application } from '@splinetool/runtime';
import gsap from 'gsap';
import SplitType from 'split-type'
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit, AfterViewInit {
    @ViewChild('burger', { static: true }) burger!: ElementRef;
    @ViewChild('canvas', { static: true }) canvas!: ElementRef;

    isBurgerActive: boolean = false;
    isDescActive: boolean = false;

    lines!: HTMLElement[] | null;    
    
    ngOnInit(): void {
        this.loadCanvas();
        this.showBurger();
    };
    
    ngAfterViewInit(): void {
        const animatedText: SplitType = new SplitType('.animatedText', { types: 'lines'});
        this.lines = animatedText.lines;
    }

    showBurger(): void {
        gsap.registerPlugin(ScrollTrigger)
        gsap.to(this.burger, {
            scrollTrigger: {
                trigger: document.documentElement,
                start: 0,
                end: window.innerHeight,
                onLeave: () => {gsap.to(this.burger.nativeElement, {scale: 1, duration: 0.25, ease: "power1.out"})},
                onEnterBack: () => {gsap.to(this.burger.nativeElement, {scale: 0, duration: 0.25, ease: "power1.out"})}
            }
        })
    };

    toggleBurger(): void {
        this.isBurgerActive = !this.isBurgerActive;
    };

    loadCanvas = () => {
        const app = new Application(this.canvas.nativeElement);
        app.load('https://prod.spline.design/BG4bjPoQSPboMO2Y/scene.splinecode');
    };

    animateText = () => {
        gsap.fromTo(this.lines, 
            {y: 100, opacity: 0},
            {y: 0, opacity: 1, stagger: 0.3, delay: 0.3, duration: 1.5, ease: 'power4.out'});
    }
}
