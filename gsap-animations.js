// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // --- HOME PAGE ANIMATIONS --- //
    const imageWrapper = document.querySelector('.image-wrapper');
    const gridBlocks = document.querySelectorAll('.grid-block');

    if (imageWrapper && gridBlocks.length > 0) {
        
        // Define initial visible state securely
        gsap.set(gridBlocks, {
            clipPath: "inset(0% 0% 0% 0%)" 
        });

        // Binding to scroll bounds natively without timeline drops
        gsap.to(gridBlocks, {
            clipPath: "inset(0% 0% 100% 0%)", // Clips upwards naturally swallowing element contents
            ease: "none",
            scrollTrigger: {
                trigger: imageWrapper,
                start: "top 70px", // Begins after fixed navbar
                end: "bottom center",
                scrub: true, // Scrub directly on wheel activity
            }
        });
    }

    // --- SIGNATURE TREATMENTS ANIMATIONS --- //
    const treatmentsSection = document.querySelector('.treatments-section');
    const largeImg = document.querySelector('.cell-large-img');
    const smallImg = document.querySelector('.cell-small-img');
    const textBoxes = document.querySelectorAll('.treatments-grid .t-text-box');

    if (treatmentsSection && largeImg && smallImg && textBoxes.length > 0) {
        
        // Define exact polygon states ensuring identical masking across all webkit engines
        const clipTopHidden = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"; // A flat line at the very top (Reveals Top -> Bottom)
        const clipBottomHidden = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"; // A flat line at the very bottom (Reveals Bottom -> Top)
        const clipFull = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"; // Fully revealed shape

        // Set Initial States for 1-way Wipe Revealing
        gsap.set(largeImg, { clipPath: clipTopHidden }); // Will grow downwards from the top
        gsap.set(smallImg, { clipPath: clipBottomHidden }); // Will grow upwards from the bottom
        gsap.set(textBoxes, { clipPath: clipBottomHidden }); // Will grow upwards from the bottom

        // Timeline Triggered Once
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: treatmentsSection,
                start: "top 75%", // Triggers when top of section hits 75% depth in viewport bounds
                once: true 
            }
        });

        // Sequence actions mapping to rules
        tl.to(largeImg, {
            clipPath: clipFull,
            duration: 0.8,
            ease: "power2.out"
        })
        .to(textBoxes, {
            clipPath: clipFull,
            duration: 0.8,
            stagger: 0.2, // Sequentially revealing text 1st, 2nd, 3rd mapped identically 
            ease: "power2.out"
        }, "<") // Align simultaneously with largeImg 
        .to(smallImg, {
            clipPath: clipFull,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.4");
    }

    // --- TRUSTED SECTION HEADER REVEAL --- //
    const trustedSection = document.querySelector('.trusted-section');
    const trustedH2 = document.querySelector('.trusted-content h2');

    if (trustedSection && trustedH2) {
        const rawH2 = trustedH2.innerHTML;
        trustedH2.innerHTML = `<div style="overflow: hidden; display: block;"><span class="trusted-h2-inner" style="display: block;">${rawH2}</span></div>`;
        const innerH2 = document.querySelector('.trusted-h2-inner');

        gsap.set(innerH2, { yPercent: 110, opacity: 0 });

        gsap.to(innerH2, {
            scrollTrigger: {
                trigger: trustedSection,
                start: "center center", // Triggers only when user hits the absolute middle of section
                once: true
            },
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power4.out"
        });
    }

    // --- REVIEW SECTION (AWWWARDS STYLE TEXT REVEAL) --- //
    const testimonialsSection = document.querySelector('.testimonials-grid');
    const quoteCells = document.querySelectorAll('.t-quote-cell');
    
    if (testimonialsSection && quoteCells.length > 0) {
        // Dynamically wrap text nodes to simulate line-split masking bounds
        quoteCells.forEach(cell => {
            const rawText = cell.innerHTML;
            cell.innerHTML = `<div style="overflow: hidden; display: inline-flex;"><span class="quote-text-inner" style="display: inline-block;">${rawText}</span></div>`;
        });

        const innerQuotes = document.querySelectorAll('.quote-text-inner');

        // Set initial shifted state (dropping text visibly down out of the mask)
        gsap.set(innerQuotes, { yPercent: 110, opacity: 0 });

        // Trigger staggered reveal precisely when grid scales the 85% bottom boundary
        gsap.to(innerQuotes, {
            scrollTrigger: {
                trigger: testimonialsSection,
                start: "center center", // Delays staggered animation until clearly visible
                once: true
            },
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.15, // Creates the classic cascading sequence across the 5 quotes
            ease: "power4.out" // Heavy friction curve mapped to Awwwards standards
        });
    }

    // --- TRANSFORMATIONS WIPE REVEAL (INDEX.HTML) --- //
    const transformSection = document.querySelector('.transformations-section');
    const transformLeft = document.querySelector('.transform-left');
    const transformRight = document.querySelector('.transform-right');
    const transformText = document.querySelector('.transform-center-text');
    const transformAction = document.querySelector('.transform-action-box');

    if (transformSection && transformLeft && transformRight && transformText) {
        
        // Define exact polygon states for horizontal wiping
        const clipFull = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
        // Right Edge: Starts at 100% X, wiping towards 0% X (Right -> Left)
        const clipRightEdge = "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"; 
        // Left Edge: Starts at 0% X, wiping towards 100% X (Left -> Right)
        const clipLeftEdge = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"; 

        // Initial masked states mimicking center-origin splits
        gsap.set(transformLeft, { clipPath: clipRightEdge }); // before.png (wipes towards the left)
        gsap.set(transformRight, { clipPath: clipLeftEdge }); // after.png (wipes towards the right)
        gsap.set([transformText, transformAction], { yPercent: 50, opacity: 0 }); // Prepares text & button to rise up

        const tlTransform = gsap.timeline({
            scrollTrigger: {
                trigger: transformSection,
                start: "top 85%", // Triggers earlier while scrolling near the bottom of previous section
                once: true
            }
        });

        // Split the image wipes concurrently extending horizontally
        tlTransform.to([transformLeft, transformRight], {
            clipPath: clipFull,
            duration: 1.8, // Slightly slower mask speed
            ease: "power3.out"
        })
        // Reveal the text block smoothly as the images wipe open
        .to([transformText, transformAction], {
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=1.2"); 
    }

    // --- NAVBAR HIDE ON SCROLL DOWN / SHOW ON SCROLL UP --- //
    const header = document.querySelector('.navbar');
    if (header) {
        // Add CSS transition safely overriding any missing stylesheets purely to be bulletproof
        header.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
            if (currentScrollTop > 200) { 
                if (currentScrollTop > lastScrollTop) {
                    // Scrolling Down -> Hide Header natively allowing core CSS transition to breathe
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling Up -> Reveal Header
                    header.style.transform = 'translateY(0)';
                }
            } else {
                // At absolute top -> Always Reveal 
                header.style.transform = 'translateY(0)';
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; 
        });
    }

    // --- GLOBAL TEXT REVEAL ANIMATIONS (AWWWARDS STYLE) --- //
    const globalTexts = gsap.utils.toArray('h1, h2, h3, h4, p');
    globalTexts.forEach(el => {
        // Exclude specific structural nodes running unique timelines or grid dependencies
        if (
            el.closest('.navbar') || 
            el.closest('.footer') ||
            el.closest('form') || 
            el.closest('button') || 
            el.closest('a') || 
            el.closest('.transform-center-text') || 
            el.closest('.trusted-content') || 
            el.closest('.testimonials-grid') || 
            el.closest('.treatments-grid') ||
            el.closest('.availability-info') ||
            el.closest('.calendar-widget') ||
            el.classList.contains('no-anim')
        ) return;

        // Dynamically wrap text nodes into an overflow mask guaranteeing perfect line-wipes structurally
        const rawContent = el.innerHTML;
        el.innerHTML = `<span style="display: block; overflow: hidden;"><span class="global-text-inner" style="display: block;">${rawContent}</span></span>`;
        const innerSpan = el.querySelector('.global-text-inner');

        // Apply heavy structural bottom-up translation inside the mask seamlessly
        gsap.from(innerSpan, {
            scrollTrigger: {
                trigger: el, // Bind directly to the element again so it tracks perfectly with viewport
                start: "top 95%", // Triggers slightly earlier (entering bottom 5% of screen) to ensure visibility
                once: true
            },
            yPercent: 120, // Pushes entirely beneath the line base
            opacity: 0,
            duration: 1.4,
            ease: "power4.out"
        });
    });

    // --- GALLERY HOVER CROSSFADE REVEAL --- //
    const gallerySection = document.querySelector('.gallery-section');
    const textCells = document.querySelectorAll('.g-text-cell');

    if (gallerySection && textCells.length > 0) {
        let activeLayer = null; // Tracks the currently visible overlay

        const createLayer = (imgSrc) => {
            const layer = document.createElement('div');
            Object.assign(layer.style, {
                position: 'absolute',
                top: '0', left: '0',
                width: '100%', height: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                backgroundImage: `url('${imgSrc}')`,
                pointerEvents: 'none',
                zIndex: '5',
                opacity: '0'
            });
            gallerySection.appendChild(layer);
            return layer;
        };

        textCells.forEach(cell => {
            cell.addEventListener('mouseenter', () => {
                const imgSrc = cell.getAttribute('data-hover-img');
                if (!imgSrc) return;

                const newLayer = createLayer(imgSrc);

                // Fade out and destroy old layer while new one fades in — clean crossfade
                if (activeLayer) {
                    const outgoing = activeLayer;
                    gsap.to(outgoing, {
                        opacity: 0, duration: 0.5, ease: "power2.inOut",
                        onComplete: () => { if (outgoing.parentNode) outgoing.remove(); }
                    });
                }

                activeLayer = newLayer;
                gsap.to(newLayer, { opacity: 0.29, duration: 0.6, ease: "power2.out" });
            });

            cell.addEventListener('mouseleave', () => {
                if (activeLayer) {
                    const outgoing = activeLayer;
                    activeLayer = null;
                    gsap.to(outgoing, {
                        opacity: 0, duration: 0.8, ease: "power2.inOut",
                        onComplete: () => { if (outgoing.parentNode) outgoing.remove(); }
                    });
                }
            });
        });
    }
});
