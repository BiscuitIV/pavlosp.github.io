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

const contact = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pavlos-paparrizos/" },
    { label: "Email", href: "mailto:pavlos.paparrizos@gmail.com" }
];

const projectKeys = Object.keys(projects);
const drawingNumber = key => String(projectKeys.indexOf(key) + 1).padStart(2, "0");

document.addEventListener("DOMContentLoaded", function () {
    const $ = id => document.getElementById(id);

    const list = $("project-links-container");
    const homeView = $("home-view");
    const projectView = $("project-view");

    const frameWrap = $("frame-wrap");
    const frame = $("frame");
    const featuredVideo = $("featured-video");
    const caption = $("video-text");
    const idleCaption = matchMedia("(hover: hover)").matches ? "Hover a part to preview" : "Tap a part to open";

    let videoTimeout;
    let previewToken = 0;

    caption.textContent = idleCaption;

    function clearVideo(video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
    }

    // CONTACT LINKS (one source for every view)
    document.querySelectorAll(".contact-links").forEach(el => {
        contact.forEach(({ label, href }) => {
            const a = document.createElement("a");
            a.href = href;
            a.textContent = label;
            if (href.startsWith("http")) {
                a.target = "_blank";
                a.rel = "noopener";
            }
            el.appendChild(a);
        });
    });

    // TITLE BLOCK ({ title, no, date }, or null for the idle sheet)
    function setTitleBlock(info) {
        $("tb-title").textContent = info ? info.title : "Portfolio index";
        $("tb-no").textContent = info ? info.no : "00";
        $("tb-date").textContent = info ? info.date : "2026";
    }

    // PREVIEW (shared by project rows and resume entries)
    const card = $("frame-card");

    function activatePanel(info) {
        ++previewToken;
        clearTimeout(videoTimeout);

        const { width, height } = frame.getBoundingClientRect();
        $("dim-w").textContent = Math.round(width);
        $("dim-h").textContent = Math.round(height);
        frameWrap.classList.add("is-active");
        frame.classList.add("has-preview");
        setTitleBlock(info);
        featuredVideo.classList.remove("visible");
    }

    function fillCard(meta, title, body, caption) {
        $("card-meta").textContent = meta;
        $("card-title").textContent = title;
        $("card-body").replaceChildren(body);
        $("card-caption").textContent = caption;
    }

    function fillProjectCard(key, excerptText) {
        const proj = projects[key];
        const excerpt = document.createElement("p");
        excerpt.className = "card-excerpt";
        excerpt.textContent = excerptText;
        fillCard(`Dwg no. ${drawingNumber(key)} · ${proj.date}`, proj.title, excerpt, "No render on file · Open →");
    }

    function showPreview(key) {
        const proj = projects[key];
        activatePanel({ title: proj.title, no: drawingNumber(key), date: proj.date });
        const token = previewToken;
        card.hidden = Boolean(proj.video);

        if (!proj.video) {
            // Strip the <strong> markup from the first paragraph
            const excerpt = document.createElement("div");
            excerpt.innerHTML = proj.text[0] || "";
            fillProjectCard(key, excerpt.textContent);
            clearVideo(featuredVideo);
            return;
        }

        videoTimeout = setTimeout(() => {
            featuredVideo.src = proj.video;
            featuredVideo.play()
                .then(() => {
                    if (token === previewToken) featuredVideo.classList.add("visible");
                })
                .catch(() => {
                    if (token !== previewToken) return;
                    // Fall back to the spec card when the browser can't play the file
                    fillProjectCard(key, "Render unavailable in this browser.");
                    card.hidden = false;
                });
        }, 200);
    }

    function hidePreview() {
        ++previewToken;
        clearTimeout(videoTimeout);
        frameWrap.classList.remove("is-active");
        frame.classList.remove("has-preview");
        featuredVideo.classList.remove("visible");
        card.hidden = true;
        setTitleBlock(null);

        videoTimeout = setTimeout(() => clearVideo(featuredVideo), 300);
    }

    // Resume entry: the row's own body (bullets or description) is the single source for the card
    function showEntry(entry) {
        const years = entry.closest("dd").previousElementSibling.textContent;
        const title = entry.querySelector(".entry-title").textContent;
        const org = entry.querySelector(".entry-meta");

        activatePanel({ title, no: "—", date: years });
        fillCard(
            org ? `${years} · ${org.textContent}` : years,
            title,
            entry.querySelector(":scope > :not(summary)").cloneNode(true),
            entry.open ? "Click row to collapse" : "Click row to expand"
        );
        card.hidden = false;
        clearVideo(featuredVideo);
    }

    document.querySelectorAll("details.entry").forEach(entry => {
        const summary = entry.querySelector("summary");
        entry.addEventListener("mouseenter", () => showEntry(entry));
        entry.addEventListener("mouseleave", hidePreview);
        summary.addEventListener("focus", () => showEntry(entry));
        summary.addEventListener("blur", hidePreview);
        // Keep the caption's expand/collapse hint in sync while the row is active
        entry.addEventListener("toggle", () => {
            if (entry.matches(":hover, :focus-within")) showEntry(entry);
        });
    });

    // GENERATE INDEX
    projectKeys.forEach(key => {
        const proj = projects[key];
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.className = "part";
        link.href = `#${key}`;
        link.innerHTML = `
            <span class="mono part-no">${drawingNumber(key)}</span>
            <span class="part-title">${proj.title}</span>
            <span class="mono part-year">${proj.date}</span>
        `;

        link.addEventListener("mouseenter", () => showPreview(key));
        link.addEventListener("focus", () => showPreview(key));
        link.addEventListener("mouseleave", hidePreview);
        link.addEventListener("blur", hidePreview);

        li.appendChild(link);
        list.appendChild(li);
    });

    // ROUTING (#project-key opens a project, anything else shows the index)
    const projectVideo = $("project-video");

    function route() {
        const key = decodeURIComponent(location.hash.slice(1));
        const proj = projects[key];

        homeView.hidden = Boolean(proj);
        projectView.hidden = !proj;

        if (!proj) {
            clearVideo(projectVideo);
            document.title = "Pavlos P";
            return;
        }

        hidePreview();
        document.title = `${proj.title} · Pavlos P`;
        $("project-title").textContent = proj.title;
        $("project-no").textContent = drawingNumber(key);
        $("spec-no").textContent = drawingNumber(key);
        $("spec-date").textContent = proj.date;
        $("spec-render").textContent = proj.video ? "On file" : "None";

        $("project-frame").hidden = !proj.video;
        if (proj.video) {
            projectVideo.src = proj.video;
            projectVideo.play().catch(() => {});
        } else {
            clearVideo(projectVideo);
        }

        const descContainer = $("project-description-container");
        descContainer.innerHTML = "";
        proj.text.forEach(paragraph => {
            const p = document.createElement("p");
            // innerHTML allows the <strong> lead-ins in the project data
            p.innerHTML = paragraph;
            descContainer.appendChild(p);
        });

        window.scrollTo(0, 0);
    }

    window.addEventListener("hashchange", route);
    route();
});