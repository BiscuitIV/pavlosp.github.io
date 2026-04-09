const projects = {
    "lithium-battery-research-article": {
        title: "How Lithium Batteries Work",
        date: "2026",
        video: "",
        text: [
            "For the past year I have developed a love for cycling."
        ]
    },
    "glider-plane": {
        title: "Glider Plane",
        date: "2024-2026",
        video: "2025-01-25 12-26-36.mkv",
        text: [
            "<strong>This project began</strong> with the goal of creating a one meter wingspan RC plane that would be under 250 grams. The design was initially two carbon fiber tubes as the wing connected perpendicularly to another two carbon fiber tubes which served as the fuselage. This system allowed for adaptible attachment of components which is important for maintaining balance.",
            "<strong>Within a month</strong> I was able to make the first prototype with a bit of design help from a friend. I had never flown a RC plane before and the runway that I was using was a rough asphault road. I crashed the plane three times before concluding that there was some sort of issue and so I continued improving the design: making components lighter, strengthening specific region, and so on.",
            "<strong>After going through</strong> the project weeks later I started to doubt the frame design for its non desired ability to twist and made the choice to switch to flat carbon fiber plates redesigning each component. This brings me to today where soon I will get upgraded electronics to finish this project off."
        ]
    },
    "cycling": {
        title: "Cycling",
        date: "2024-2026",
        video: "",
        text: [
            "For the past year I have developed a love for cycling."
        ]
    },
    "fpv-drone-frame": {
        title: "FPV Drone Frame",
        date: "2024",
        video: "DroneFrameRender0001-0600.mkv",
        text: [
            "This project began with the goal of creating a one meter wingspan RC plane that would be under 250 grams. The design was initially two carbon fiber tubes as the wing connected perpendicularly..."
        ]
    },
    "beeper": {
        title: "Beeper",
        date: "2024",
        video: "",
        text: [
            "A friend was fidgeting with some electronics at school and I helped him connect a battery, to a beeper, separated by a switch. From there I decided to take the fun idea and make it into a PCB design and a full product. I downloaded KiCAD and began without a clue for what I was doing. Within a couple minutes I called my electrical engineering father to guide me through finding components and checking datasheets."
        ]
    },
    "ender-3-s1-pro": {
        title: "Ender 3 S1 Pro",
        date: "2023",
        video: "3D Printer Video.mov",
        text: [
            "During 2023 my sibling bought this 3D printer. He initially downloaded and printed various online models which peaked my curiosity. As he became more and more busy with classes and homework the printer became vastly available."
        ]
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("project-links-container");
    const featuredVideo = document.getElementById("featured-video");
    const videoText = document.getElementById("video-text");
    
    const homeView = document.getElementById("home-view");
    const projectView = document.getElementById("project-view");
    const backBtn = document.getElementById("back-home-btn");

    let videoTimeout;

    // GENERATE LINKS
    Object.keys(projects).forEach(key => {
        const proj = projects[key];
        const link = document.createElement("a");
        link.className = "headline-date";
        link.href = "#";
        link.setAttribute("data-video", proj.video);
        
        link.innerHTML = `
            <p class="project-text">${proj.title}</p>
            <p class="date-text">${proj.date}</p>
        `;

        // HOVER LOGIC
        link.addEventListener("mouseenter", () => {
            const videoSource = link.getAttribute("data-video");
            clearTimeout(videoTimeout);

            if (videoSource) {
                featuredVideo.classList.remove("visible");
                videoText.style.opacity = "0";

                videoTimeout = setTimeout(() => {
                    featuredVideo.src = videoSource;
                    featuredVideo.play()
                        .then(() => featuredVideo.classList.add("visible"))
                        .catch(err => console.log("Video empty or failed"));
                }, 200); // slightly faster response
            }
        });

        link.addEventListener("mouseleave", () => {
            clearTimeout(videoTimeout);
            featuredVideo.classList.remove("visible");
            videoText.style.opacity = "1";

            videoTimeout = setTimeout(() => {
                featuredVideo.pause();
                featuredVideo.src = "";
            }, 300); 
        });

        // CLICK LOGIC (Open Project)
        link.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Populate Data
            document.getElementById("project-title").innerText = proj.title;
            const descContainer = document.getElementById("project-description-container");
            descContainer.innerHTML = "";
            
            proj.text.forEach(paragraph => {
                const p = document.createElement("p");
                p.className = "project-description";
                // Changed to innerHTML to allow <strong> tags for scannability
                p.innerHTML = paragraph; 
                descContainer.appendChild(p);
            });

            // Switch Views
            homeView.style.display = "none";
            projectView.style.display = "flex";
            window.scrollTo(0, 0); 
        });

        container.appendChild(link);
    });

    // BACK BUTTON
    backBtn.addEventListener("click", (e) => {
        e.preventDefault();
        projectView.style.display = "none";
        homeView.style.display = "flex";
    });
});