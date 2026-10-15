// ---------- LWS aerodynamics ----------
const WING_CHORD = 0.11; // m, Generation X

// Profiles normalized to chord = 1 (TE → upper → LE → lower → TE), from the UIUC Airfoil
// Coordinates Database, cosine-resampled to 35 stations per surface.
// polar: [α°, Cl, Cd], XFOIL at Re 50,000, Ncrit 9 (airfoiltools.com), α −5° to 12°;
// gaps are angles where XFOIL did not converge
const airfoils = [
    {
        name: "E205", gen: "Gen 9", chord: 0.100, cl: 0.3403, cd: 0.0586,
        points: [[1,0],[0.9979,0.0002],[0.9915,0.0011],[0.9809,0.0026],[0.9662,0.005],[0.9476,0.008],[0.9251,0.0116],[0.899,0.0156],[0.8695,0.02],[0.8368,0.0249],[0.8013,0.0302],[0.7632,0.0358],[0.7229,0.0417],[0.6806,0.0478],[0.6368,0.054],[0.5919,0.0602],[0.5461,0.066],[0.5,0.0715],[0.4539,0.076],[0.4081,0.0795],[0.3632,0.0815],[0.3194,0.082],[0.2771,0.0808],[0.2368,0.078],[0.1987,0.0739],[0.1632,0.0686],[0.1305,0.0623],[0.101,0.0552],[0.0749,0.0474],[0.0524,0.0391],[0.0338,0.0305],[0.0191,0.0218],[0.0085,0.0133],[0.0021,0.0051],[0,0],[0.0021,-0.0046],[0.0085,-0.0086],[0.0191,-0.0126],[0.0338,-0.016],[0.0524,-0.0189],[0.0749,-0.0211],[0.101,-0.0227],[0.1305,-0.0238],[0.1632,-0.0243],[0.1987,-0.0244],[0.2368,-0.024],[0.2771,-0.0234],[0.3194,-0.0225],[0.3632,-0.0214],[0.4081,-0.0201],[0.4539,-0.0187],[0.5,-0.0173],[0.5461,-0.0158],[0.5919,-0.0143],[0.6368,-0.0129],[0.6806,-0.0115],[0.7229,-0.0102],[0.7632,-0.0089],[0.8013,-0.0078],[0.8368,-0.0067],[0.8695,-0.0056],[0.899,-0.0046],[0.9251,-0.0036],[0.9476,-0.0026],[0.9662,-0.0015],[0.9809,-0.0007],[0.9915,-0.0002],[0.9979,0],[1,0]],
        polar: [[-5,-0.4222,0.05333],[-4.75,-0.4162,0.04802],[-4.5,-0.4069,0.04401],[-4.25,-0.3957,0.04134],[-4,-0.3822,0.03879],[-3.75,-0.3665,0.03664],[-3.5,-0.3486,0.03476],[-3.25,-0.3292,0.03309],[-3,-0.3098,0.03139],[-2.75,-0.2669,0.02983],[-2.5,-0.2213,0.02838],[-2.25,-0.1749,0.02675],[-2,-0.0936,0.02234],[-1.75,-0.0457,0.02293],[-1.5,-0.0011,0.02348],[-1.25,0.0359,0.024],[-1,0.0713,0.02454],[-0.75,0.1058,0.0251],[-0.5,0.1438,0.02566],[-0.25,0.1842,0.02619],[0,0.2074,0.02684],[0.25,0.2347,0.0275],[0.5,0.276,0.02804],[0.75,0.297,0.0288],[1,0.3165,0.02963],[1.25,0.3543,0.03024],[1.5,0.3716,0.03114],[1.75,0.3861,0.03217],[2,0.4309,0.03266],[2.25,0.4307,0.03403],[2.5,0.4491,0.0351],[2.75,0.481,0.0359],[3,0.482,0.03742],[3.25,0.5106,0.03836],[3.5,0.5227,0.03971],[3.75,0.532,0.04117],[4,0.5725,0.04189],[4.25,0.5672,0.04379],[4.5,0.5803,0.04529],[4.75,0.6144,0.04618],[5,0.6203,0.04791],[5.25,0.6275,0.04966],[5.5,0.645,0.05111],[5.75,0.6688,0.05231],[6,0.6948,0.05337],[6.25,0.719,0.05442],[6.5,0.7393,0.05559],[6.75,0.7529,0.05705],[7,0.7636,0.05867],[7.25,0.7742,0.06028],[7.5,0.7937,0.06125],[7.75,0.8556,0.05871],[8,0.8578,0.06067],[8.25,0.9929,0.04906],[8.5,1.0547,0.04365],[8.75,1.0932,0.04029],[9,1.1413,0.03565],[9.25,1.1523,0.03535],[9.5,1.1589,0.03606],[9.75,1.1653,0.03758],[10,1.1676,0.0399],[10.25,1.1701,0.04235],[10.5,1.1727,0.04484],[10.75,1.1715,0.04746],[11,1.1787,0.05038],[11.5,1.1926,0.05731],[11.75,1.1854,0.06083],[12,1.178,0.06463]]
    },
    {
        name: "FX 60-100", gen: "Gen X", chord: WING_CHORD, cl: 0.4728, cd: 0.0510,
        points: [[1,0],[0.9979,0.0004],[0.9915,0.0017],[0.9809,0.0038],[0.9662,0.0068],[0.9476,0.0105],[0.9251,0.015],[0.899,0.0201],[0.8695,0.0257],[0.8368,0.0317],[0.8013,0.038],[0.7632,0.0444],[0.7229,0.0506],[0.6806,0.0565],[0.6368,0.0619],[0.5919,0.0666],[0.5461,0.0707],[0.5,0.0741],[0.4539,0.0766],[0.4081,0.0783],[0.3632,0.079],[0.3194,0.0786],[0.2771,0.0771],[0.2368,0.0746],[0.1987,0.0711],[0.1632,0.0665],[0.1305,0.0611],[0.101,0.0551],[0.0749,0.0483],[0.0524,0.0409],[0.0338,0.0331],[0.0191,0.0249],[0.0085,0.0165],[0.0021,0.0076],[0,0],[0.0021,-0.0028],[0.0085,-0.0064],[0.0191,-0.0103],[0.0338,-0.0139],[0.0524,-0.0174],[0.0749,-0.02],[0.101,-0.0223],[0.1305,-0.024],[0.1632,-0.0249],[0.1987,-0.025],[0.2368,-0.0243],[0.2771,-0.0228],[0.3194,-0.0203],[0.3632,-0.017],[0.4081,-0.013],[0.4539,-0.0086],[0.5,-0.0041],[0.5461,0.0004],[0.5919,0.0045],[0.6368,0.008],[0.6806,0.0106],[0.7229,0.0125],[0.7632,0.0135],[0.8013,0.0138],[0.8368,0.0133],[0.8695,0.0121],[0.899,0.0106],[0.9251,0.0087],[0.9476,0.0067],[0.9662,0.0046],[0.9809,0.0028],[0.9915,0.0013],[0.9979,0.0003],[1,0]],
        polar: [[-5,-0.3284,0.03999],[-4.75,-0.2983,0.03655],[-4.5,-0.2713,0.03346],[-4.25,-0.2429,0.03105],[-4,-0.2142,0.02898],[-3.75,-0.186,0.02726],[-3.5,-0.1608,0.02572],[-3.25,-0.1318,0.02399],[-3,-0.111,0.02348],[-2.75,-0.1049,0.0246],[-2.5,-0.0969,0.02512],[-2.25,-0.0865,0.02521],[-2,-0.073,0.02511],[-1.75,-0.0586,0.02488],[-1.5,-0.042,0.02464],[-1.25,-0.0244,0.0244],[-1,-0.0063,0.02419],[-0.75,0.011,0.02398],[-0.5,0.0262,0.02377],[-0.25,0.0409,0.02354],[0,0.0596,0.02324],[0.25,0.0919,0.0236],[0.5,0.1315,0.02443],[0.75,0.1666,0.02534],[1,0.2322,0.02693],[1.25,0.2864,0.02822],[1.5,0.3351,0.02939],[1.75,0.3809,0.03049],[2,0.4275,0.03151],[2.25,0.4756,0.03242],[2.5,0.5165,0.03324],[2.75,0.5517,0.03406],[3,0.5902,0.03478],[3.25,0.6348,0.03525],[3.5,0.6781,0.03556],[3.75,0.7094,0.03609],[4,0.7528,0.03614],[4.25,0.8099,0.03521],[4.5,0.8409,0.03513],[4.75,0.8949,0.03342],[5,0.9305,0.0326],[5.25,0.9744,0.03095],[5.5,1.0134,0.02956],[5.75,1.0465,0.02866],[6,1.0803,0.02782],[6.25,1.1057,0.02753],[6.5,1.1247,0.02774],[6.75,1.1445,0.02823],[7,1.1614,0.02942],[7.25,1.1795,0.03088],[7.5,1.1967,0.03256],[7.75,1.2169,0.03444],[8,1.2364,0.03646],[8.25,1.261,0.03883],[8.5,1.2796,0.04113],[8.75,1.3014,0.04373],[9,1.3193,0.04678],[9.25,1.3373,0.05037],[9.5,1.344,0.05411],[9.75,1.3656,0.05727],[10,1.3582,0.0614],[10.25,1.3504,0.06592],[10.5,1.3371,0.07085],[10.75,1.3152,0.07606],[11,1.2842,0.08127],[11.25,1.2506,0.08722],[11.5,1.2192,0.09422],[11.75,1.1956,0.10187]]
    }
];

// ISA troposphere density and Sutherland viscosity at altitude h (m)
function air(h) {
    const T = 288.15 - 0.0065 * h;
    const rho = 101325 * Math.pow(T / 288.15, 5.2559) / (287.05 * T);
    const mu = 1.458e-6 * Math.pow(T, 1.5) / (T + 110.4);
    return { rho, mu };
}

const reynolds = (v, h) => {
    const { rho, mu } = air(h);
    return rho * v * WING_CHORD / mu;
};

const formatRe = re => (Math.round(re / 100) * 100).toLocaleString("en-US");

const projects = {
    "placeholder": {
        title: "Placeholder",
        date: "2026",
        video: "",
        text: [
            "Placeholder"
        ]
    },
    "plane": {
        title: "LWS X",
        date: "2024-2026",
        video: "",
        image: "Velocity Picture.png",
        specs: {
            title: "Generation X",
            groups: [
                { group: "Airframe", rows: [
                    ["Target mass", "210 g (limit 250 g)"],
                    ["Wingspan", "972 mm (2 × 486 mm)"],
                    ["Chord", "110 mm"],
                    ["Incidence", "5°"],
                    ["Materials", "PLA, balsa"]
                ] },
                { group: "Aerodynamics", rows: [
                    ["Airfoil", "FX 60-100"],
                    ["Cl", "0.4728"],
                    ["Cd", "0.0510"],
                    ["L/D", "≈ 9.3"],
                    ["Re @ 7 m/s", `≈ ${formatRe(reynolds(7, 0))}`]
                ] },
                { group: "Propulsion", rows: [
                    ["Motor", "2003.5"],
                    ["Propeller", "7×4.5 bi-blade"],
                    ["ESC", "2–3S, 15 A"]
                ] },
                { group: "Power", rows: [
                    ["Battery", "2S 1200 mAh"],
                    ["Voltage", "7.4 V nominal"],
                    ["Energy", "8.9 Wh"],
                    ["Mass", "56 g"]
                ] },
                { group: "Mission", rows: [
                    ["Cruise target", "7 m/s"],
                    ["Level flight", "8.34 m/s (current)"],
                    ["Payload", "≥ 40 g, ≥ 5 W"],
                    ["Endurance", "≥ 30 min @ 15 °C"],
                    ["Altitude", "0–150 m"]
                ] }
            ]
        },
        text: [
            "<strong>The Low Weight System (LWS)</strong> began in 2024 with a clear target: a radio-controlled plane with a one-metre wingspan that weighed under 250 grams. I had never flown an RC plane before. The early versions were as much a learning process as an aircraft project. Across nine generations and the current Generation X, the design went from a tube glider that flew for about three seconds to a two-piece airframe built around one principle: remove weight wherever it does not serve flight.",
            { heading: "Generation One: The Tube Glider" },
            "The first design used two carbon fibre tubes for the wing, joined perpendicularly to two more tubes that formed the fuselage. The tubes allowed components to be attached and repositioned easily, which mattered for keeping the aircraft balanced. The airfoil was the E205, a profile commonly used on gliders. The wing had a 100mm chord and was mounted at 0° angle of incidence.",
            "Power came from a bulky 2814 brushless motor, a 30A ESC weighing 32g, and a 6-inch propeller. I tested 2S and 3S batteries before settling on a 2S 720mAh LiPo with a nominal voltage of 7.6V. I also designed 3D-printed wheels and experimented with compressible wheels for landing.",
            "The first prototype was built within a month. I crashed it three times on a rough asphalt runway, then made it lighter, reinforced specific areas, and kept iterating. At 263g, it was already over the 250g target. It flew for only about three seconds before nose-diving. The lesson was clear: a tubular fuselage lacked the structural integrity to fly well.",
            { heading: "Generations Four to Eight: The Two-Piece Frame" },
            "The next generations used a two-piece frame, built from tubes or balsa wood, with one piece per side and all internal components housed inside. I evaluated cardboard, balsa wood, and carbon fibre for the structure. Each revision kept the original function of each part: the string-and-pulley servo system was replaced with a flap linkage system as part of the frame composition upgrade, and the wing mount was made adjustable, and a 2207 drone motor replaced the original motor. Starting with Generation Four, the servos were switched from 9g to 5g units to save weight.",
            "Flight times in this range were measured in seconds, and the main failure was crashing, largely because I was still learning to fly. Weight decreased with each generation, though I don't have exact figures for every one. Over the following generations, components were strengthened, the battery was repositioned, the outer shapes were refined for better aerodynamics, a lighter ESC was adopted, and a stripped-down receiver was used to save weight. This sequence of crash-tested revisions produced the modern plane.",
            { heading: "Generation Nine: The Predecessor" },
            "The Predecessor is the ninth generation of the LWS. Its final frame is built from balsa, which gave the right balance of stiffness and weight for this airframe. At 216g, it came in under the 250g target. Its ESC weighs 10g, down from 32g for the original ESC.",
            { heading: "Generation X: Front and Rear Body" },
            "Generation X splits the airframe into two sections: a front body and a rear body. Frame plates connect the two, and each body is streamlined for performance without compromising the joint between them.",
            { heading: "Generation X: Development" },
            "Generation X is currently in development. It is built from PLA and balsa, with carbon fibre under consideration, and it uses custom PCBs designed from scratch. The main goal is to bring the weight down while still carrying a useful payload. The modern design uses a 5° angle of incidence and a 110mm chord, compared with 0° and 100mm in the first generation. The newest battery is a 2S 1200mAh pack with a nominal voltage of 7.4V, storing about 8.9Wh and weighing 56g. The earlier 2S 720mAh pack stored about 5.3Wh and weighed 36.5g. The new pack holds about 3.6Wh more, roughly 67% more energy, for 19.5g more weight, about 53% heavier. Energy per gram improves slightly, from about 0.15Wh/g to 0.16Wh/g.",
            "The design requirements are: the aircraft must weigh under 250g including battery and payload; carry at least 40g of electronics (camera, video transmitter, flight controller, and GPS) in a protected bay; and power those electronics with at least 5W. It should fly at least 30 minutes at 15°C and 15 minutes at 0°C with full payload, cruise steadily at about 7 m/s, and be thrown by hand by one person.",
            "It should also swap batteries in under a minute without tools, fit in a backpack, be ready to fly within five minutes, and operate between 0 and 150 metres. The airframe and propulsion should cost under $250, excluding electronics. Regulatory and safety requirements, including frequency selection for FPV, lighting for night flying, and privacy and local laws, are being reviewed alongside the design.",
            "The target weight for Generation X is 210g, and the 250g limit still applies. Compared with the 6-inch propeller used in the first three generations, it uses a 7-inch 7x4.5 Bi-Blade propeller, driven by a 2003.5 motor and a 2S to 3S 15A ESC. Its two wings are each 486mm wide. The custom PCBs are designed to provide optimal electronic functionality while saving weight, and a flight controller is being added for a larger feature set and more automation.",
            { heading: "Aerodynamic Design Tool" },
            "The streamlining of both bodies was guided by CFD through a GUI I developed on top of OpenFOAM, the open-source CFD toolkit. The goal was to make aerodynamic adjustments quick enough to iterate on between builds, rather than relying on slow, manual simulation setup. So far, CFD analysis has been run at level flight and compares only Generation Nine and Generation X.",
            { heading: "Airfoil Selection" },
            "After testing multiple airfoils, Generation X uses the FX 60-100. Compared with Generation Nine, the drag coefficient (Cd) dropped from 0.0586 to 0.0510, about 13% lower, and the lift coefficient (Cl) rose from 0.3403 to 0.4728, about 39% higher. The lift-to-drag ratio improved from about 5.8 to about 9.3, roughly 60% better.",
            { figure: "airfoils" },
            { figure: "polars" },
            "The airfoils were compared across the Reynolds number range expected at the goal operating altitudes, from 0 to 150 metres. With the 110mm chord, the Reynolds number at the 7 m/s cruise target is roughly 52,700 at sea level in the standard atmosphere.",
            { figure: "reynolds" },
            "[GUI section to be added.]",
            { heading: "Performance" },
            "The first generation weighed 263g and flew for about three seconds. The Predecessor weighs 216g, 47g lighter, about 18% less weight. Level flight speed was 10.1 m/s for Generation Nine and is 8.34 m/s so far for Generation X, against a cruise target of 7 m/s. The next step is further aerodynamic revision to reduce the cruise speed. [Flight time for the Predecessor and additional performance figures to be added.]"
        ]
    }
};

const contact = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pavlos-paparrizos/" },
    { label: "Email", href: "mailto:pavlos.paparrizos@gmail.com" }
];

const projectKeys = Object.keys(projects);
const drawingNumber = key => String(projectKeys.indexOf(key) + 1).padStart(2, "0");

// ---------- Project text: strings are paragraphs, { heading } a subheading, { figure: name } a figure ----------
function makeFigure(plateClass, plateHTML, caption) {
    const fig = document.createElement("figure");
    fig.className = "fig";
    fig.innerHTML = `<div class="fig-plate grid-paper ${plateClass}">${plateHTML}</div><figcaption class="mono muted">${caption}</figcaption>`;
    return fig;
}

// Round tick values covering [min, max] in about `count` steps
function niceTicks(min, max, count) {
    const raw = (max - min) / count;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map(f => f * mag).find(s => s >= raw);
    const ticks = [];
    for (let v = Math.floor(min / step) * step; v < max + step - 1e-9; v += step) ticks.push(+v.toFixed(10));
    return ticks;
}

// Polar plots share one renderer; each picks its axes from a [α, Cl, Cd] row
const polarCharts = [
    { title: "Cl vs α", xLabel: "α (°)", yLabel: "Cl", byX: true, x: p => p[0], y: p => p[1] },
    { title: "Cl/Cd vs α", xLabel: "α (°)", yLabel: "Cl/Cd", byX: true, x: p => p[0], y: p => p[1] / p[2] },
    { title: "Cl vs Cd (drag polar)", xLabel: "Cd", yLabel: "Cl", byX: false, x: p => p[2], y: p => p[1] }
];

const seriesClass = i => (i === airfoils.length - 1 ? "polar-curr" : "polar-prev");

function polarPanel(chart) {
    const panel = document.createElement("div");
    panel.className = "polar-panel";
    panel.innerHTML = `
        <p class="mono-data muted polar-title">${chart.title}</p>
        <div class="polar-plot">
            <svg class="polar-svg" role="img" aria-label="${chart.title} for ${airfoils.map(af => af.name).join(" and ")}, XFOIL at Re 50,000"></svg>
            <div class="mono-data polar-tip" hidden></div>
        </div>`;
    const plot = panel.querySelector(".polar-plot");
    const svg = panel.querySelector("svg");
    const tip = panel.querySelector(".polar-tip");
    const H = 240;
    const m = { t: 12, r: 88, b: 44, l: 52 };
    let width = 0;
    let sx, sy, series;

    function draw() {
        series = airfoils.map((af, i) => ({ af, cls: seriesClass(i), pts: af.polar.map(p => [chart.x(p), chart.y(p), p]) }));
        const all = series.flatMap(s => s.pts);
        const xt = niceTicks(Math.min(...all.map(p => p[0])), Math.max(...all.map(p => p[0])), width < 420 ? 5 : 8);
        const yt = niceTicks(Math.min(...all.map(p => p[1])), Math.max(...all.map(p => p[1])), 6);
        const [x0, x1, y0, y1] = [xt[0], xt.at(-1), yt[0], yt.at(-1)];
        const right = width - m.r;
        const bottom = H - m.b;
        sx = v => m.l + (v - x0) / (x1 - x0) * (right - m.l);
        sy = v => m.t + (y1 - v) / (y1 - y0) * (bottom - m.t);

        // Direct labels at each curve's end, pushed apart when they would collide
        const ends = series.map(s => ({ s, x: sx(s.pts.at(-1)[0]) + 8, y: sy(s.pts.at(-1)[1]) }));
        if (ends.length === 2 && Math.abs(ends[0].y - ends[1].y) < 16) {
            const mid = (ends[0].y + ends[1].y) / 2;
            const [lo, hi] = ends[0].y <= ends[1].y ? ends : [ends[1], ends[0]];
            lo.y = mid - 8;
            hi.y = mid + 8;
        }

        svg.setAttribute("viewBox", `0 0 ${width} ${H}`);
        svg.setAttribute("height", H);
        svg.innerHTML = `
            ${yt.map(v => `<line class="${v === 0 ? "polar-zero" : "polar-grid"}" x1="${m.l}" x2="${right}" y1="${sy(v)}" y2="${sy(v)}"/>
                <text class="polar-tick" x="${m.l - 8}" y="${sy(v)}" dy="0.32em" text-anchor="end">${v}</text>`).join("")}
            <line class="polar-axis" x1="${m.l}" x2="${right}" y1="${bottom}" y2="${bottom}"/>
            ${xt.map(v => `<line class="polar-axis" x1="${sx(v)}" x2="${sx(v)}" y1="${bottom}" y2="${bottom + 5}"/>
                <text class="polar-tick" x="${sx(v)}" y="${bottom + 18}" text-anchor="middle">${v}</text>`).join("")}
            <text class="polar-tick" x="${(m.l + right) / 2}" y="${H - 4}" text-anchor="middle">${chart.xLabel}</text>
            <text class="polar-tick" transform="translate(12 ${(m.t + bottom) / 2}) rotate(-90)" text-anchor="middle">${chart.yLabel}</text>
            ${series.map(s => `<path class="polar-line ${s.cls}" d="M${s.pts.map(p => `${sx(p[0]).toFixed(1)} ${sy(p[1]).toFixed(1)}`).join("L")}"/>`).join("")}
            ${ends.map(e => `<text class="polar-label" x="${e.x}" y="${e.y}" dy="0.32em">${e.s.af.name}</text>`).join("")}
            <g class="polar-hover" visibility="hidden">
                <line class="polar-cross" y1="${m.t}" y2="${bottom}"/>
                ${series.map(s => `<circle class="${s.cls}" r="4"/>`).join("")}
            </g>
            <rect class="polar-hit" x="${m.l}" y="${m.t}" width="${right - m.l}" height="${bottom - m.t}"/>`;
    }

    // Hover: α charts read both curves at the pointer's α; the drag polar reads the nearest point
    function hover(e) {
        const r = svg.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        const dist = p => (chart.byX ? Math.abs(sx(p[0]) - px) : Math.hypot(sx(p[0]) - px, sy(p[1]) - py));
        let hits = series.map(s => ({ s, p: s.pts.reduce((a, b) => (dist(b) < dist(a) ? b : a)) }));
        if (!chart.byX) hits = [hits.reduce((a, b) => (dist(b.p) < dist(a.p) ? b : a))];

        const g = svg.querySelector(".polar-hover");
        const cross = g.querySelector("line");
        cross.setAttribute("visibility", chart.byX ? "visible" : "hidden");
        cross.setAttribute("x1", sx(hits[0].p[0]));
        cross.setAttribute("x2", sx(hits[0].p[0]));
        g.querySelectorAll("circle").forEach((c, i) => {
            const hit = hits.find(h => h.s === series[i]);
            c.setAttribute("visibility", hit ? "visible" : "hidden");
            if (hit) {
                c.setAttribute("cx", sx(hit.p[0]));
                c.setAttribute("cy", sy(hit.p[1]));
            }
        });
        g.setAttribute("visibility", "visible");

        tip.innerHTML = hits.map(({ s, p: [, , [a, cl, cd]] }) => `
            <p><span class="title polar-tip-name">${s.af.name}</span>
            α ${a}° · Cl ${cl.toFixed(3)} · Cd ${cd.toFixed(4)} · Cl/Cd ${(cl / cd).toFixed(1)}</p>`).join("");
        tip.hidden = false;
        const left = px + 16 + tip.offsetWidth > width ? px - 16 - tip.offsetWidth : px + 16;
        tip.style.left = `${Math.max(0, left)}px`;
        tip.style.top = `${m.t}px`;
    }

    svg.addEventListener("pointermove", hover);
    svg.addEventListener("pointerleave", () => {
        svg.querySelector(".polar-hover").setAttribute("visibility", "hidden");
        tip.hidden = true;
    });

    // Draw at the real container width so text stays legible on narrow screens
    new ResizeObserver(([entry]) => {
        const w = Math.round(entry.contentRect.width);
        if (w && w !== width) {
            width = w;
            draw();
        }
    }).observe(plot);

    return panel;
}

// Key values per airfoil: best of each column over the plotted α range
function polarSummary() {
    const pick = (pts, score) => pts.reduce((a, b) => (score(b) > score(a) ? b : a));
    const cell = ([a], v) => `${v} <span class="muted">@ ${a}°</span>`;
    const rows = airfoils.map(af => {
        const clMax = pick(af.polar, p => p[1]);
        const ldMax = pick(af.polar, p => p[1] / p[2]);
        const cdMin = pick(af.polar, p => -p[2]);
        return `<tr><th scope="row" class="title">${af.name}</th>
            <td>${cell(clMax, clMax[1].toFixed(3))}</td>
            <td>${cell(ldMax, (ldMax[1] / ldMax[2]).toFixed(1))}</td>
            <td>${cell(cdMin, cdMin[2].toFixed(4))}</td></tr>`;
    }).join("");
    return `<table class="mono-data polar-table">
        <thead class="muted"><tr><th scope="col">Airfoil</th><th scope="col">Cl max</th><th scope="col">Max Cl/Cd</th><th scope="col">Min Cd</th></tr></thead>
        <tbody>${rows}</tbody></table>`;
}

const figures = {
    // True-scale section overlay, each airfoil at its own chord from a shared leading edge (SVG units are mm, y up)
    airfoils() {
        const chordMm = af => Math.round(af.chord * 1000);
        const mm = Math.max(...airfoils.map(chordMm));
        const path = af => "M" + af.points.map(([x, y]) => `${(x * chordMm(af)).toFixed(2)} ${(-y * chordMm(af)).toFixed(2)}`).join("L") + "Z";
        const ticks = Array.from({ length: mm / 10 + 1 }, (_, i) => {
            const x = i * 10;
            return `<line class="af-tick" x1="${x}" y1="5" x2="${x}" y2="${i % 5 ? 6 : 7}"/>`;
        }).join("");
        const [prev, curr] = airfoils;
        const legend = airfoils.map((af, i) => `
            <li>
                <i class="swatch${i === airfoils.length - 1 ? "" : " swatch-dash"}"></i>
                <span class="title">${af.name}</span>
                <span class="mono-data muted">${af.gen} · ${chordMm(af)} mm chord · Cl ${af.cl.toFixed(4)} · Cd ${af.cd.toFixed(4)} · L/D ${(af.cl / af.cd).toFixed(1)}</span>
            </li>`).join("");

        return makeFigure("af", `
            <svg class="af-plot" viewBox="0 -10 ${mm} 17" role="img"
                aria-label="${prev.name} (${chordMm(prev)} mm chord) and ${curr.name} (${chordMm(curr)} mm chord) airfoil sections overlaid at true scale">
                <line class="af-chord" x1="0" y1="0" x2="${mm}" y2="0"/>
                <path class="af-prev" d="${path(prev)}"/>
                <path class="af-curr" d="${path(curr)}"/>
                <line class="af-tick" x1="0" y1="5" x2="${mm}" y2="5"/>${ticks}
            </svg>
            <div class="af-scale mono muted" aria-hidden="true"><span>0</span><span>${mm} mm</span></div>
            <ul class="fig-legend">${legend}</ul>`,
            `Fig. 1 — Airfoil sections at true scale, ${prev.gen} vs ${curr.gen}`);
    },

    // XFOIL section polars: three single-axis charts plus a key-values table
    polars() {
        const legend = airfoils.map((af, i) => `
            <li><i class="swatch${i === airfoils.length - 1 ? "" : " swatch-dash"}"></i>
            <span class="title">${af.name}</span><span class="mono-data muted">${af.gen}</span></li>`).join("");
        const fig = makeFigure("polars", `
            <ul class="fig-legend fig-legend-row">${legend}</ul>
            <div class="polar-charts"></div>
            ${polarSummary()}`,
            "Fig. 2 — 2D section polars, XFOIL at Re 50,000, Ncrit 9 (airfoiltools.com) · hover to read values");
        fig.querySelector(".polar-charts").append(...polarCharts.map(polarPanel));
        return fig;
    },

    // Live Re = ρVc/μ over the operating envelope
    reynolds() {
        const fig = makeFigure("re", `
            <p class="re-eq" role="img" aria-label="Reynolds number equals density times airspeed times chord, divided by dynamic viscosity">
                <i>Re</i> = <span class="frac"><span>ρ<i>V</i><i>c</i></span><span>μ</span></span>
            </p>
            <div class="re-inputs">
                <label class="re-input"><span class="mono-data muted">Airspeed <i>V</i></span><input type="range" min="4" max="12" step="0.1" value="7"><output class="mono-data"></output></label>
                <label class="re-input"><span class="mono-data muted">Altitude <i>h</i></span><input type="range" min="0" max="150" step="5" value="0"><output class="mono-data"></output></label>
            </div>
            <dl class="cells re-values">
                <div><dt class="mono-data muted">ρ density</dt><dd class="mono-data" data-out="rho"></dd></div>
                <div><dt class="mono-data muted">μ viscosity</dt><dd class="mono-data" data-out="mu"></dd></div>
                <div><dt class="mono-data muted">c chord</dt><dd class="mono-data">${WING_CHORD.toFixed(3)} m</dd></div>
                <div class="re-total"><dt class="mono-data muted">Re</dt><dd class="mono-data" data-out="re" aria-live="polite"></dd></div>
            </dl>`,
            "Fig. 3 — Reynolds number of the Gen X wing, ISA standard atmosphere");

        const [speed, alt] = fig.querySelectorAll("input");
        const out = name => fig.querySelector(`[data-out="${name}"]`);

        function update() {
            const v = Number(speed.value);
            const h = Number(alt.value);
            const { rho, mu } = air(h);
            speed.nextElementSibling.value = `${v.toFixed(1)} m/s`;
            alt.nextElementSibling.value = `${h} m`;
            out("rho").textContent = `${rho.toFixed(3)} kg/m³`;
            out("mu").textContent = `${(mu * 1e5).toFixed(3)}×10⁻⁵ Pa·s`;
            out("re").textContent = formatRe(reynolds(v, h));
        }

        speed.addEventListener("input", update);
        alt.addEventListener("input", update);
        update();
        return fig;
    }
};

function renderSpecs(container, { title, groups }) {
    container.querySelector(".section-head").textContent = `Spec sheet · ${title}`;
    container.querySelector(".spec-groups").replaceChildren(...groups.map(({ group, rows }) => {
        const cell = document.createElement("div");
        cell.className = "spec-group";
        const head = document.createElement("p");
        head.className = "mono spec-group-head";
        head.textContent = group;
        const dl = document.createElement("dl");
        dl.className = "kv spec-rows";
        rows.forEach(([label, value]) => {
            const dt = document.createElement("dt");
            dt.className = "mono-data";
            dt.textContent = label;
            const dd = document.createElement("dd");
            dd.className = "mono-data";
            dd.textContent = value;
            dl.append(dt, dd);
        });
        cell.append(head, dl);
        return cell;
    }));
}

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
            a.className = "link";
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
        // The whole row (date column and spacing included) is the hover target, so rows tile without gaps
        const row = entry.closest("dd").parentElement;
        row.addEventListener("mouseenter", () => showEntry(entry));
        row.addEventListener("mouseleave", hidePreview);
        summary.addEventListener("focus", () => showEntry(entry));
        summary.addEventListener("blur", hidePreview);
        // Keep the caption's expand/collapse hint in sync while the row is active
        entry.addEventListener("toggle", () => {
            if (row.matches(":hover, :focus-within")) showEntry(entry);
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
            <span class="mono muted part-no">${drawingNumber(key)}</span>
            <span class="title title-md link">${proj.title}</span>
            <span class="mono muted">${proj.date}</span>
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
    const projectImage = $("project-image");

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
        $("spec-render").textContent = proj.video || proj.image ? "On file" : "None";

        $("project-frame").hidden = !proj.video && !proj.image;
        projectImage.hidden = !proj.image;
        if (proj.image) {
            projectImage.src = proj.image;
        } else {
            projectImage.removeAttribute("src");
        }
        if (proj.video) {
            projectVideo.src = proj.video;
            projectVideo.play().catch(() => {});
        } else {
            clearVideo(projectVideo);
        }

        const specs = $("project-specs");
        specs.hidden = !proj.specs;
        if (proj.specs) renderSpecs(specs, proj.specs);

        const descContainer = $("project-description-container");
        descContainer.innerHTML = "";
        proj.text.forEach(item => {
            if (item.heading) {
                const h = document.createElement("h3");
                h.className = "subhead";
                h.textContent = item.heading;
                descContainer.appendChild(h);
                return;
            }
            if (item.figure) {
                descContainer.appendChild(figures[item.figure]());
                return;
            }
            const p = document.createElement("p");
            // innerHTML allows the <strong> lead-ins in the project data
            p.innerHTML = item;
            descContainer.appendChild(p);
        });

        window.scrollTo(0, 0);
    }

    window.addEventListener("hashchange", route);
    route();
});