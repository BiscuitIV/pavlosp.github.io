// ---------- LWS aerodynamics ----------
const WING_CHORD = 0.11; // m, Generation X

// Profiles normalized to chord = 1 (TE → upper → LE → lower → TE), cosine-resampled to 35 stations
// per surface: E205 from the UIUC Airfoil Coordinates Database, I.S.A. 960 from the batch run's
// simulated geometry (trailing edge closed, repanelled by XFoil).
// polar: [α°, Cl, Cd], own XFoil 6.99 batch run at Re 60,000, Ncrit 9, 160 panels, α −5° to 12°;
// gaps are angles where XFoil did not converge. cl/cd: the best-Cl/Cd point for α 0–5° (cruise window)
const airfoils = [
    {
        name: "E205", gen: "Gen 9", chord: 0.100, cl: 0.6509, cd: 0.03285,
        points: [[1,0],[0.9979,0.0002],[0.9915,0.0011],[0.9809,0.0026],[0.9662,0.005],[0.9476,0.008],[0.9251,0.0116],[0.899,0.0156],[0.8695,0.02],[0.8368,0.0249],[0.8013,0.0302],[0.7632,0.0358],[0.7229,0.0417],[0.6806,0.0478],[0.6368,0.054],[0.5919,0.0602],[0.5461,0.066],[0.5,0.0715],[0.4539,0.076],[0.4081,0.0795],[0.3632,0.0815],[0.3194,0.082],[0.2771,0.0808],[0.2368,0.078],[0.1987,0.0739],[0.1632,0.0686],[0.1305,0.0623],[0.101,0.0552],[0.0749,0.0474],[0.0524,0.0391],[0.0338,0.0305],[0.0191,0.0218],[0.0085,0.0133],[0.0021,0.0051],[0,0],[0.0021,-0.0046],[0.0085,-0.0086],[0.0191,-0.0126],[0.0338,-0.016],[0.0524,-0.0189],[0.0749,-0.0211],[0.101,-0.0227],[0.1305,-0.0238],[0.1632,-0.0243],[0.1987,-0.0244],[0.2368,-0.024],[0.2771,-0.0234],[0.3194,-0.0225],[0.3632,-0.0214],[0.4081,-0.0201],[0.4539,-0.0187],[0.5,-0.0173],[0.5461,-0.0158],[0.5919,-0.0143],[0.6368,-0.0129],[0.6806,-0.0115],[0.7229,-0.0102],[0.7632,-0.0089],[0.8013,-0.0078],[0.8368,-0.0067],[0.8695,-0.0056],[0.899,-0.0046],[0.9251,-0.0036],[0.9476,-0.0026],[0.9662,-0.0015],[0.9809,-0.0007],[0.9915,-0.0002],[0.9979,0],[1,0]],
        polar: [[-4.75,-0.4266,0.04756],[-4.5,-0.4163,0.04283],[-4.25,-0.4042,0.04036],[-4,-0.3899,0.0377],[-3.75,-0.3437,0.03373],[-3.5,-0.2979,0.03113],[-3.25,-0.2511,0.02911],[-3,-0.209,0.02753],[-2.75,-0.1677,0.02621],[-2.5,-0.1246,0.02422],[-2.25,-0.0109,0.02032],[-2,0.034,0.02051],[-1.75,0.0766,0.02072],[-1.5,0.1184,0.02093],[-1.25,0.1593,0.02113],[-1,0.2032,0.02124],[-0.75,0.2386,0.02147],[-0.5,0.2655,0.02183],[-0.25,0.2922,0.02224],[0,0.3243,0.02253],[0.25,0.3537,0.02287],[0.5,0.3721,0.0235],[0.75,0.3952,0.02404],[1,0.4272,0.02433],[1.25,0.4416,0.02517],[1.5,0.4615,0.02587],[1.75,0.4916,0.02623],[2,0.5043,0.02724],[2.25,0.5237,0.02806],[2.5,0.5505,0.02857],[2.75,0.5615,0.02978],[3,0.5858,0.03046],[3.25,0.6051,0.03134],[3.5,0.6159,0.03269],[3.75,0.6509,0.03285],[4,0.6588,0.03437],[4.25,0.6692,0.03582],[4.5,0.6969,0.03634],[4.75,0.7172,0.03721],[5,0.7262,0.03877],[5.25,0.7404,0.04002],[5.5,0.7671,0.04049],[5.75,0.8034,0.04016],[6,0.8176,0.04128],[6.25,0.8356,0.04209],[6.5,0.8573,0.04253],[6.75,0.8842,0.04244],[7,0.9162,0.04174],[7.25,0.9542,0.04031],[7.5,1.002,0.03772],[7.75,1.0145,0.0381],[8,1.067,0.03454],[8.25,1.093,0.03321],[8.5,1.1212,0.03146],[8.75,1.139,0.03051],[9,1.1515,0.03014],[9.25,1.1558,0.03088],[9.5,1.1585,0.03236],[9.75,1.1582,0.03434],[10,1.1595,0.03651],[10.25,1.1532,0.03857],[10.5,1.1455,0.04069],[10.75,1.1403,0.04317],[11,1.1497,0.04612],[11.25,1.1709,0.04961],[11.5,1.1747,0.05246],[11.75,1.1906,0.05603],[12,1.1849,0.05934]]
    },
    {
        name: "I.S.A. 960", gen: "Gen X", chord: WING_CHORD, cl: 0.9983, cd: 0.02282,
        points: [[1,0.0021],[0.9979,0.0027],[0.9915,0.0045],[0.9809,0.0074],[0.9662,0.0112],[0.9476,0.0156],[0.9251,0.0205],[0.899,0.026],[0.8695,0.0326],[0.8368,0.04],[0.8013,0.0479],[0.7632,0.0553],[0.7229,0.0626],[0.6806,0.07],[0.6368,0.0776],[0.5919,0.0845],[0.5461,0.0903],[0.5,0.0951],[0.4539,0.0991],[0.4081,0.1021],[0.3632,0.1039],[0.3194,0.1043],[0.2771,0.1031],[0.2368,0.101],[0.1987,0.0987],[0.1632,0.0958],[0.1305,0.0876],[0.101,0.0793],[0.0749,0.0748],[0.0524,0.0649],[0.0338,0.0547],[0.0191,0.0442],[0.0085,0.0344],[0.0021,0.0268],[-0.0003,0.0196],[0.0021,0.0148],[0.0085,0.0103],[0.0191,0.0064],[0.0338,0.0031],[0.0524,0.0004],[0.0749,0.0001],[0.101,0.0001],[0.1305,0.0017],[0.1632,0.0039],[0.1987,0.0056],[0.2368,0.0074],[0.2771,0.0092],[0.3194,0.0105],[0.3632,0.0113],[0.4081,0.0117],[0.4539,0.0121],[0.5,0.0121],[0.5461,0.0115],[0.5919,0.0105],[0.6368,0.0097],[0.6806,0.0089],[0.7229,0.0081],[0.7632,0.0072],[0.8013,0.0064],[0.8368,0.0056],[0.8695,0.0049],[0.899,0.0042],[0.9251,0.0035],[0.9476,0.003],[0.9662,0.0026],[0.9809,0.0023],[0.9915,0.0022],[0.9979,0.0021],[1,0.0021]],
        polar: [[-5,-0.3817,0.06765],[-4.75,-0.3705,0.06466],[-4.5,-0.3592,0.06191],[-4,-0.261,0.04787],[-3.75,-0.1988,0.04255],[-3.5,-0.142,0.0382],[-3.25,-0.0857,0.03557],[-3,-0.0338,0.03303],[-2.75,0.018,0.03176],[-2.5,0.0619,0.03085],[-2.25,0.1116,0.02982],[-2,0.1516,0.02902],[-1.75,0.188,0.02841],[-1.5,0.2321,0.02762],[-1.25,0.283,0.02661],[-1,0.3196,0.02558],[-0.75,0.393,0.02316],[-0.5,0.4313,0.02291],[-0.25,0.4691,0.02259],[0,0.5105,0.02212],[0.25,0.5398,0.02193],[0.75,0.5991,0.02152],[1,0.6289,0.02132],[1.25,0.6585,0.0212],[1.5,0.6897,0.02105],[1.75,0.7202,0.0209],[2,0.7459,0.02091],[2.25,0.7705,0.02099],[2.5,0.7949,0.02107],[2.75,0.8191,0.02115],[3,0.8401,0.02132],[3.25,0.8617,0.02145],[3.5,0.8852,0.02153],[3.75,0.9102,0.02157],[4,0.9321,0.02179],[4.25,0.9564,0.02198],[4.5,0.9774,0.02235],[4.75,0.9983,0.02282],[5,1.02,0.02336],[5.25,1.0418,0.02397],[5.5,1.062,0.02464],[5.75,1.0821,0.02531],[6,1.1032,0.02605],[6.25,1.1246,0.02685],[6.5,1.1467,0.02774],[6.75,1.17,0.02875],[7,1.1938,0.02991],[7.25,1.2183,0.0312],[7.5,1.247,0.03255],[7.75,1.269,0.03405],[8,1.2964,0.03557],[8.25,1.3228,0.03731],[8.5,1.337,0.03909],[8.75,1.3624,0.04002],[9,1.3686,0.04115],[9.25,1.3815,0.0421],[9.5,1.3952,0.04268],[9.75,1.4047,0.04296],[10,1.4028,0.04401],[10.25,1.3993,0.04443],[10.5,1.3907,0.04455],[10.75,1.3743,0.04557],[11,1.3583,0.04683],[11.25,1.3426,0.04837],[11.5,1.3268,0.05055],[11.75,1.3389,0.05633],[12,1.3271,0.0599]]
    }
];

// Airfoil sweep: every foil from the batch run with a converged cruise window (273 of 275), ranked.
// [name, max thickness at 110 mm chord (mm), max camber (% chord), best Cl/Cd for α 0–5°, α of that best (°)]
const SWEEP_PICK = "I.S.A. 960";
const sweep = [["mid108a",9.2,3.5,45.0,5.0],["mid108b",9.2,3.0,44.1,5.0],["GOE 388",11.2,5.4,44.0,5.0],["I.S.A. 960",10.3,5.7,43.7,4.75],["fg1",9.0,4.1,42.8,4.5],["GOE 164",9.8,6.6,42.4,5.0],["S2046",9.9,2.6,42.3,5.0],["n9",9.3,4.2,42.0,4.75],["GOE 274",9.4,4.8,41.9,4.25],["mid107",10.9,4.0,41.7,5.0],["goe564",9.0,2.7,41.6,5.0],["eiffel430",10.7,6.3,41.5,5.0],["I.S.A. 961",10.2,5.7,41.5,5.0],["wsm825",9.1,2.5,41.3,5.0],["hn217",8.9,2.3,41.2,5.0],["hn470jt",8.8,2.0,41.1,5.0],["I.S.A. 962",10.5,5.9,41.1,5.0],["hn1032",8.9,2.0,41.1,5.0],["hn1029",8.9,2.2,40.9,5.0],["S4110",9.2,3.1,40.9,5.0],["hn507",9.0,2.1,40.9,5.0],["hn374",8.9,2.0,40.8,5.0],["hn033",8.9,1.9,40.7,5.0],["hn035",8.8,1.9,40.7,5.0],["hn239",8.9,2.1,40.5,5.0],["hn417",8.8,2.3,40.5,5.0],["s2048",9.5,1.9,40.5,5.0],["sb96_lm",8.9,3.0,40.5,5.0],["hn354e",8.9,1.9,40.4,5.0],["hn216",8.9,1.9,40.4,5.0],["hn354sm",9.2,2.3,40.4,5.0],["hn973",9.2,2.4,40.4,5.0],["hn1051",9.4,2.0,40.4,5.0],["naca2408",8.8,2.0,40.2,5.0],["hn465",9.2,2.2,40.1,5.0],["hn038",8.9,1.8,40.1,5.0],["hn418",9.4,2.5,40.1,5.0],["hn360",9.2,2.1,40.1,5.0],["hn707",9.0,1.9,40.1,5.0],["jwl046",10.1,2.6,40.0,5.0],["GOE 565",9.2,2.8,40.0,5.0],["fx60100sm",11.0,3.5,40.0,5.0],["goe585",9.0,3.4,40.0,5.0],["hn464",9.2,2.0,39.9,5.0],["hn1069",9.3,2.0,39.9,5.0],["hn981",8.9,1.9,39.9,5.0],["hn354oc",9.4,2.6,39.9,5.0],["hn470",8.8,1.6,39.9,5.0],["hn989",8.8,1.8,39.9,5.0],["tp50-ds",8.8,1.8,39.8,5.0],["hn839d",9.4,2.4,39.8,5.0],["hn034",8.9,1.8,39.8,5.0],["mid31_F3J_F5J",9.5,2.3,39.8,5.0],["hn216ta",9.1,1.8,39.8,5.0],["hn333",9.3,2.0,39.7,5.0],["hn163tb",9.2,1.9,39.7,5.0],["hn184m",9.4,2.4,39.7,5.0],["hn801",9.3,2.0,39.6,5.0],["hq2590sm",9.9,2.5,39.6,5.0],["hq259b",9.9,2.5,39.6,5.0],["FX60-100",11.0,3.6,39.6,5.0],["hn354a",9.3,2.0,39.6,5.0],["hn354sr",8.9,1.6,39.6,5.0],["hn211",9.0,1.7,39.6,5.0],["wsa828",8.8,2.8,39.6,4.5],["wsi925",10.1,2.5,39.5,5.0],["mid029",9.5,2.5,39.5,5.0],["hn452",9.2,1.8,39.4,5.0],["hn424",9.7,2.6,39.3,5.0],["hn354es",8.9,1.5,39.3,5.0],["goe363",12.2,5.7,39.2,3.5],["hn350m02",9.7,2.3,39.2,5.0],["goe622",8.8,2.5,39.1,5.0],["hn163",9.4,1.8,39.1,5.0],["ami43",9.0,3.6,39.0,4.75],["hn184",9.4,1.8,39.0,5.0],["GOE 282",10.0,5.0,39.0,5.0],["hn1036",9.4,1.8,39.0,5.0],["goe566",9.5,2.6,39.0,5.0],["ag24",9.3,2.2,39.0,5.0],["s9000",9.9,2.4,39.0,5.0],["hn1015",9.3,1.7,38.8,5.0],["arad10",10.8,4.0,38.8,4.5],["hn1054",9.4,1.6,38.7,5.0],["mve8516f3",9.3,1.6,38.6,5.0],["goe563",9.8,2.2,38.6,5.0],["hn436",9.3,1.7,38.6,5.0],["hn1038",9.0,1.5,38.6,5.0],["hq1585",9.4,1.5,38.5,5.0],["hn163ta",9.5,1.7,38.5,5.0],["hn450",9.2,1.9,38.4,5.0],["hn350m01",9.9,1.9,38.3,5.0],["SD7037",10.1,3.0,38.2,5.0],["sd7080",10.1,2.5,38.2,5.0],["sb96_mu",9.3,1.7,38.2,5.0],["ag23",9.8,2.2,38.2,5.0],["hn380",10.1,2.3,38.1,5.0],["rg15",9.8,1.8,38.0,5.0],["SELIG 3002",10.9,3.0,38.0,5.0],["hn450s",9.4,1.9,38.0,5.0],["usnps4",13.0,5.0,38.0,5.0],["ds19",9.3,2.0,37.9,5.0],["hn227",9.9,2.4,37.9,5.0],["goe281",8.8,4.5,37.9,5.0],["GOE 176",11.4,5.6,37.8,3.5],["fx601001",11.1,3.6,37.8,5.0],["mrv120",9.6,2.3,37.8,5.0],["hn838",9.0,1.8,37.7,5.0],["sd8000",9.7,1.7,37.7,5.0],["hs179",9.9,1.7,37.7,5.0],["DP1_72-8_16_DS",9.0,1.7,37.6,5.0],["GOE 165",13.3,5.7,37.6,5.0],["jwl042",9.4,2.5,37.6,5.0],["jwl043",9.4,2.5,37.6,5.0],["SA7038",10.1,3.2,37.5,5.0],["E212",11.6,2.9,37.5,5.0],["hq2195",10.4,2.1,37.4,5.0],["tp202-9",9.9,1.7,37.4,5.0],["cb2195",10.4,2.1,37.4,5.0],["ag52",9.2,1.8,37.3,5.0],["mu8.5_1.73",9.4,1.8,37.3,5.0],["rk40",9.3,2.1,37.3,5.0],["mh32",9.6,2.4,37.2,5.0],["ds21",9.5,1.8,37.2,5.0],["hq159b",9.8,1.5,37.2,5.0],["S7075",9.9,3.0,37.2,5.0],["hq209",9.9,2.0,37.1,5.0],["hq159",9.9,1.5,37.1,5.0],["SD7043",10.0,3.5,37.0,4.75],["rg12a189",9.9,1.8,37.0,5.0],["rg12a",9.9,1.8,37.0,5.0],["nm23",9.3,2.2,37.0,5.0],["sa7036",10.1,2.8,37.0,5.0],["goe795",8.8,2.4,36.9,5.0],["mid327",10.0,2.4,36.8,5.0],["sb99f3j",9.9,3.5,36.7,5.0],["hn1069c",11.0,1.8,36.6,5.0],["hq2090sm",9.9,2.0,36.5,5.0],["sd8040",11.0,2.6,36.4,5.0],["HQ 2.5/9",9.9,2.5,36.4,5.0],["sa7035",10.1,2.6,36.4,5.0],["DP1_72-8_32_DS",9.1,1.7,36.3,5.0],["SD7032",11.0,3.7,36.2,5.0],["GOE 174",9.4,5.6,36.1,3.75],["hn972",11.3,2.5,36.1,5.0],["rg8",11.9,2.2,36.0,5.0],["DP1_77-8_23_DS",9.0,1.8,36.0,5.0],["GOE 180",9.5,4.4,35.9,5.0],["GOE 431",13.0,7.2,35.9,5.0],["goe670",9.9,3.4,35.8,5.0],["HQ 3.5/9",9.9,3.5,35.6,5.0],["sg6041",11.0,2.0,35.6,5.0],["goe795sm",8.8,2.4,35.6,5.0],["bambino6",13.2,6.0,35.4,4.0],["ms535-3v",13.1,3.5,35.4,5.0],["GOE 195",9.5,5.1,35.3,5.0],["hn808",11.4,2.0,35.1,5.0],["mid321a",9.9,3.2,35.1,5.0],["GOE 358",11.9,5.7,35.0,3.75],["sd2030",9.4,2.2,35.0,5.0],["S9037",9.9,3.5,35.0,5.0],["hn969",11.2,2.3,34.9,5.0],["hn971",11.9,2.4,34.9,5.0],["mid322",9.9,3.0,34.7,5.0],["hn188",11.4,2.4,34.7,5.0],["s1223rtl",14.9,8.5,34.7,1.5],["E64",9.3,3.3,34.7,5.0],["b707d",9.9,2.0,34.6,5.0],["HQ 3.0/9",9.9,3.0,34.6,5.0],["e222",11.2,2.5,34.5,5.0],["goe595",10.5,3.0,34.5,5.0],["e224",11.2,1.8,34.3,5.0],["hn409",11.5,2.5,34.1,5.0],["hn1023",11.2,2.4,34.0,5.0],["ms19_87",9.7,2.0,33.9,5.0],["naca2410",11.0,2.0,33.9,5.0],["mid321b",10.4,3.4,33.9,5.0],["HOBIE",9.3,4.0,33.9,5.0],["hs602",11.2,3.0,33.8,5.0],["b707e",9.9,1.8,33.8,5.0],["hn304",11.9,2.4,33.6,5.0],["hn309",11.9,2.1,33.6,5.0],["hq2010",11.0,2.0,33.6,5.0],["sb95_95_2",10.5,1.9,33.5,5.0],["tp210-10",11.0,1.8,33.5,5.0],["jwl044",11.6,2.5,33.4,5.0],["GOE 326",9.0,4.7,33.4,5.0],["GOE 328",8.9,4.3,33.2,5.0],["GOE 137",9.4,4.4,33.2,5.0],["hn304ta",12.2,2.4,32.9,5.0],["tp-ciel-s",10.6,1.6,32.9,5.0],["FX 63-100",10.9,4.3,32.8,5.0],["GOE 178",9.3,4.4,32.5,4.0],["sb99blkm",11.0,2.0,32.5,5.0],["hq2510",11.0,2.5,32.5,5.0],["HQ 3.5/10",11.0,3.5,32.1,5.0],["GOE 184",9.1,5.3,32.1,5.0],["hn003",11.9,2.4,31.9,5.0],["goe515",9.3,2.8,31.9,5.0],["ls413mod",14.2,2.0,31.8,5.0],["GOE 187",9.0,4.8,31.6,4.25],["goe602m",10.6,3.8,31.4,5.0],["GOE 63",9.0,6.7,31.1,5.0],["sb95_105_2",11.5,2.0,31.0,5.0],["sb99blks",11.0,2.0,31.0,5.0],["kc135d",9.9,2.0,30.9,5.0],["sb96_105_3",11.4,3.1,30.9,5.0],["mh117",10.8,2.7,30.7,5.0],["HL75-K-3rev",8.8,4.0,30.5,5.0],["GOE 188",9.8,4.4,30.5,5.0],["HOBIESMO1",9.4,4.0,30.4,5.0],["HQ 3.0/10",11.0,3.0,30.2,5.0],["FX 60-126",13.8,3.6,30.2,5.0],["ah21-7",9.9,2.3,30.0,5.0],["hn203",11.9,2.3,29.9,5.0],["AH 79-100 A",11.0,3.6,29.7,5.0],["boe103",14.0,3.6,29.2,5.0],["GOE 257",9.5,4.1,29.2,5.0],["jwl045",10.2,2.8,29.1,5.0],["GOE 602",10.9,3.5,28.7,5.0],["S3025",10.3,3.6,28.5,5.0],["hq2511",12.1,2.5,28.3,5.0],["E211",12.0,2.6,28.2,5.0],["FX 63-110",12.1,4.3,28.2,5.0],["naca2411",12.1,2.5,27.7,5.0],["S4053",9.8,3.0,27.6,5.0],["fx601261",13.9,4.0,26.9,5.0],["sd2083",9.9,2.8,26.6,5.0],["hn955",11.9,2.5,26.3,5.0],["hq3011",12.1,3.0,26.3,5.0],["E216",11.5,5.2,26.2,5.0],["S4320",10.4,4.5,26.1,4.75],["GOE 303",10.8,5.9,24.7,4.75],["SA7026",9.9,3.8,24.7,5.0],["hq2512",13.2,2.5,24.6,5.0],["SD6080",10.1,3.7,24.4,5.0],["GOE 496",10.9,5.0,24.4,5.0],["GOE 802",10.7,6.2,24.3,4.0],["hq3512",13.2,3.5,24.3,5.0],["DAE-51",10.3,4.0,23.9,5.0],["s3024",10.8,3.5,23.8,5.0],["SG6042",11.0,3.7,23.6,5.0],["hs1712",12.9,4.8,23.0,4.75],["hq3012",13.2,3.0,22.9,5.0],["S4061",10.6,3.9,22.3,5.0],["GOE 450",9.8,5.2,22.0,4.25],["goe546",11.4,3.6,21.6,5.0],["e178",9.5,2.8,21.6,5.0],["FX 63-120",13.2,5.2,21.3,4.75],["GOE 118",9.5,5.7,21.1,3.0],["E66",11.1,4.0,21.0,5.0],["PSU 94-097",10.6,4.1,20.7,5.0],["e176",9.7,3.3,20.1,5.0],["E174",9.8,3.8,19.7,4.75],["e387",10.0,3.8,19.6,5.0],["clarkv",12.8,3.4,19.3,5.0],["E214",12.2,4.0,18.8,4.75],["MH 116",10.8,4.1,18.5,5.0],["ls413",14.1,2.1,18.4,5.0],["s4062",10.5,4.1,17.7,5.0],["E385",9.3,5.7,17.6,4.5],["S4022",12.4,4.3,17.5,5.0],["mh201",14.4,2.6,17.5,5.0],["SG6043",11.0,5.5,17.1,5.0],["ec863914",15.7,4.4,16.0,5.0],["AH 79-100 B",11.0,6.4,15.8,4.5],["e67",12.8,3.7,15.8,5.0],["raf32md",11.2,4.0,14.8,5.0],["goe547",11.6,4.0,14.3,5.0],["l188tip",13.2,2.7,14.2,5.0],["AH 79-100 C",10.9,6.7,13.7,5.0],["fx83w108",12.0,4.2,12.9,5.0],["sg6051",13.0,3.2,11.3,5.0]];

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
                    ["Airfoil", "I.S.A. 960"],
                    ["Section Cl @ 4.75°", "0.998"],
                    ["Section Cd @ 4.75°", "0.0228"],
                    ["Section Cl/Cd", "≈ 43.7"],
                    ["Re @ 8 m/s", `≈ ${formatRe(reynolds(8, 0))}`],
                    ["Design Re", "60,000"]
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
            "Flight testing showed that the speed needed for level flight is closer to 8 m/s than the 7 m/s cruise target. With the 110mm chord, 8 m/s gives a Reynolds number of about 60,300 at sea level and about 59,500 at 150 metres in the standard atmosphere, so I averaged the design Reynolds number at 60,000 across the operating envelope.",
            { figure: "reynolds" },
            "To choose the airfoil, I wrote a batch pipeline around XFoil 6.99, the panel-method solver that airfoiltools.com also uses. It downloads each airfoil's coordinates from airfoiltools, the UIUC Airfoil Coordinates Database, or the AeroSandbox database, converts every file to one format, closes blunt trailing edges that XFoil would otherwise under-predict, and sweeps each section from −5° to 15° at Re 60,000. I ran 275 airfoils through it and ranked them in an interactive tool. The selection followed five steps: find the Reynolds number from the operating environment, choose a metric based on the operational goal, filter by camber and thickness, compare the polars at their optimal angles of attack, and choose the airfoil based on fabrication feasibility and the goal metrics.",
            { figure: "pipeline" },
            "The metric was the best lift-to-drag ratio (Cl/Cd) between 0° and 5°, the angles the wing actually sees in cruise with its 5° incidence. Every candidate was kept to a range of cambers and a maximum thickness of more than 8mm at the 110mm chord, so the wing can be built from balsa and PLA with room for a spar. The thinnest of the 275 is 8.8mm.",
            { figure: "sweep" },
            "Generation X uses the I.S.A. 960. It scores 43.7 at 4.75°, fourth of the 273 airfoils that converged in the cruise window and within 3% of the best score of 45.0. At 10.3mm thick with 5.7% camber, it is thicker than the two MID 108 sections that score higher, which are 9.2mm thick, and its best point falls inside the cruise window rather than at its edge.",
            "Compared with the E205 used up to Generation Nine, at each airfoil's best point in the cruise window and Re 60,000, the drag coefficient (Cd) drops from 0.0329 to 0.0228, about 31% lower, and the lift coefficient (Cl) rises from 0.651 to 0.998, about 53% higher. The best section lift-to-drag ratio improves from 19.8 to 43.7, about 2.2 times higher.",
            { figure: "airfoils" },
            { figure: "polars" },
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
            <svg class="polar-svg" role="img" aria-label="${chart.title} for ${airfoils.map(af => af.name).join(" and ")}, XFoil at Re 60,000"></svg>
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
        // Headroom above the chord line: the tallest section's upper surface plus 1 mm
        const top = Math.ceil(Math.max(...airfoils.flatMap(af => af.points.map(([, y]) => y * chordMm(af))))) + 1;
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
            <svg class="af-plot" viewBox="0 ${-top} ${mm} ${top + 7}" role="img"
                aria-label="${prev.name} (${chordMm(prev)} mm chord) and ${curr.name} (${chordMm(curr)} mm chord) airfoil sections overlaid at true scale">
                <line class="af-chord" x1="0" y1="0" x2="${mm}" y2="0"/>
                <path class="af-prev" d="${path(prev)}"/>
                <path class="af-curr" d="${path(curr)}"/>
                <line class="af-tick" x1="0" y1="5" x2="${mm}" y2="5"/>${ticks}
            </svg>
            <div class="af-scale mono muted" aria-hidden="true"><span>0</span><span>${mm} mm</span></div>
            <ul class="fig-legend">${legend}</ul>`,
            `Airfoil sections at true scale, ${prev.gen} vs ${curr.gen}`);
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
            "2D section polars, XFoil 6.99 at Re 60,000, Ncrit 9 · hover to read values");
        fig.querySelector(".polar-charts").append(...polarCharts.map(polarPanel));
        return fig;
    },

    // The batch XFoil pipeline (software chain) and the five selection steps it served
    pipeline() {
        const chain = [
            ["Airfoil databases", "airfoiltools · UIUC · AeroSandbox"],
            ["run_polars.py", "Selig format · blunt trailing edges closed"],
            ["XFoil 6.99", "Re 60,000 · Ncrit 9 · 160 panels"],
            ["results.json", "polars + cruise-window metrics"],
            ["Ranking tool", "sort, filter and compare polars"]
        ];
        const stats = [
            ["Airfoils", "275"],
            ["Converged points", "21,023"],
            ["Trailing edges closed", "27"],
            ["α sweep", "−5° to 15°, 0.25° steps"]
        ];
        const steps = [
            ["Reynolds number", "8 m/s level flight · 110 mm chord · 0–150 m ISA", "Re 60,000"],
            ["Goal metric", "best Cl/Cd for α 0–5°, the cruise window", "Cl/Cd, 0–5°"],
            ["Camber and thickness", "range of cambers · max thickness > 8 mm", "275 airfoils"],
            ["Polars at optimal α", "Cl, Cl/Cd and drag polar at each foil's best α", "273 ranked"],
            ["Fabrication and metrics", "10.3 mm thick · 5.7% camber · Cl/Cd 43.7 @ 4.75°", "I.S.A. 960"]
        ];
        return makeFigure("pipe", `
            <p class="mono muted pipe-head">Software</p>
            <ol class="cells pipe-chain">${chain.map(([name, detail], i) => `
                <li><span class="mono-data muted">${String(i + 1).padStart(2, "0")}</span>
                <span class="title">${name}</span><span class="mono-data muted">${detail}</span></li>`).join("")}
            </ol>
            <dl class="cells re-values pipe-stats">${stats.map(([k, v]) => `
                <div><dt class="mono-data muted">${k}</dt><dd class="mono-data">${v}</dd></div>`).join("")}
            </dl>
            <p class="mono muted pipe-head">Selection</p>
            <ol class="pipe-steps">${steps.map(([name, detail, result], i) => `
                <li><span class="mono-data muted">${i + 1}</span>
                <span class="pipe-step"><span class="title">${name}</span><span class="mono-data muted">${detail}</span></span>
                <span class="mono-data pipe-result">${result}</span></li>`).join("")}
            </ol>`,
            "Airfoil selection pipeline, a batch XFoil run over 275 airfoils");
    },

    // Every foil in the batch run: thickness against the cruise metric, the chosen foil highlighted
    sweep() {
        const fig = makeFigure("polars", `
            <div class="polar-plot">
                <svg class="polar-svg" role="img" aria-label="Scatter of ${sweep.length} airfoils: maximum thickness in millimetres against best Cl/Cd for α 0 to 5°. All are thicker than the 8 mm minimum; I.S.A. 960 is 10.3 mm at Cl/Cd 43.7, fourth overall."></svg>
                <div class="mono-data polar-tip" hidden></div>
            </div>`,
            `${sweep.length} airfoils from the batch run, XFoil at Re 60,000 · hover to read values`);
        const plot = fig.querySelector(".polar-plot");
        const svg = plot.querySelector("svg");
        const tip = plot.querySelector(".polar-tip");
        const H = 300;
        const m = { t: 12, r: 16, b: 44, l: 52 };
        const MIN_MM = 8;
        let width = 0;
        let sx, sy;

        function draw() {
            const xt = niceTicks(7, Math.max(...sweep.map(f => f[1])), width < 420 ? 5 : 9);
            const yt = niceTicks(Math.min(...sweep.map(f => f[3])), Math.max(...sweep.map(f => f[3])), 6);
            const [x0, x1, y0, y1] = [xt[0], xt.at(-1), yt[0], yt.at(-1)];
            const right = width - m.r;
            const bottom = H - m.b;
            sx = v => m.l + (v - x0) / (x1 - x0) * (right - m.l);
            sy = v => m.t + (y1 - v) / (y1 - y0) * (bottom - m.t);
            const pick = sweep.find(f => f[0] === SWEEP_PICK);

            svg.setAttribute("viewBox", `0 0 ${width} ${H}`);
            svg.setAttribute("height", H);
            svg.innerHTML = `
                ${yt.map(v => `<line class="polar-grid" x1="${m.l}" x2="${right}" y1="${sy(v)}" y2="${sy(v)}"/>
                    <text class="polar-tick" x="${m.l - 8}" y="${sy(v)}" dy="0.32em" text-anchor="end">${v}</text>`).join("")}
                <line class="polar-axis" x1="${m.l}" x2="${right}" y1="${bottom}" y2="${bottom}"/>
                ${xt.map(v => `<line class="polar-axis" x1="${sx(v)}" x2="${sx(v)}" y1="${bottom}" y2="${bottom + 5}"/>
                    <text class="polar-tick" x="${sx(v)}" y="${bottom + 18}" text-anchor="middle">${v}</text>`).join("")}
                <text class="polar-tick" x="${(m.l + right) / 2}" y="${H - 4}" text-anchor="middle">Max thickness (mm, 110 mm chord)</text>
                <text class="polar-tick" transform="translate(12 ${(m.t + bottom) / 2}) rotate(-90)" text-anchor="middle">Best Cl/Cd, α 0–5°</text>
                <line class="sweep-min" x1="${sx(MIN_MM)}" x2="${sx(MIN_MM)}" y1="${m.t}" y2="${bottom}"/>
                <text class="polar-tick" x="${sx(MIN_MM) + 6}" y="${bottom - 8}">8 mm min.</text>
                ${sweep.filter(f => f !== pick).map(f => `<circle class="sweep-dot" cx="${sx(f[1]).toFixed(1)}" cy="${sy(f[3]).toFixed(1)}" r="3"/>`).join("")}
                <circle class="sweep-pick" cx="${sx(pick[1])}" cy="${sy(pick[3])}" r="5"/>
                <text class="polar-label" x="${sx(pick[1]) + 10}" y="${sy(pick[3]) - 10}">${SWEEP_PICK}</text>
                <circle class="sweep-hover" r="6" visibility="hidden"/>
                <rect class="polar-hit" x="${m.l}" y="${m.t}" width="${right - m.l}" height="${bottom - m.t}"/>`;
        }

        // Hover reads the nearest foil to the pointer
        svg.addEventListener("pointermove", e => {
            const r = svg.getBoundingClientRect();
            const px = e.clientX - r.left;
            const py = e.clientY - r.top;
            const dist = f => Math.hypot(sx(f[1]) - px, sy(f[3]) - py);
            const f = sweep.reduce((a, b) => (dist(b) < dist(a) ? b : a));
            const ring = svg.querySelector(".sweep-hover");
            ring.setAttribute("cx", sx(f[1]));
            ring.setAttribute("cy", sy(f[3]));
            ring.setAttribute("visibility", "visible");
            const [name, t, camber, ld, a] = f;
            tip.innerHTML = `<p><span class="title polar-tip-name">${name}</span>
                #${sweep.indexOf(f) + 1} of ${sweep.length} · ${t} mm thick · ${camber}% camber · Cl/Cd ${ld} @ ${a}°</p>`;
            tip.hidden = false;
            const left = px + 16 + tip.offsetWidth > width ? px - 16 - tip.offsetWidth : px + 16;
            tip.style.left = `${Math.max(0, left)}px`;
            tip.style.top = `${m.t}px`;
        });
        svg.addEventListener("pointerleave", () => {
            svg.querySelector(".sweep-hover").setAttribute("visibility", "hidden");
            tip.hidden = true;
        });

        new ResizeObserver(([entry]) => {
            const w = Math.round(entry.contentRect.width);
            if (w && w !== width) {
                width = w;
                draw();
            }
        }).observe(plot);
        return fig;
    },

    // Live Re = ρVc/μ over the operating envelope
    reynolds() {
        const fig = makeFigure("re", `
            <p class="re-eq" role="img" aria-label="Reynolds number equals density times airspeed times chord, divided by dynamic viscosity">
                <i>Re</i> = <span class="frac"><span>ρ<i>V</i><i>c</i></span><span>μ</span></span>
            </p>
            <div class="re-inputs">
                <label class="re-input"><span class="mono-data muted">Airspeed <i>V</i></span><input type="range" min="4" max="12" step="0.1" value="8"><output class="mono-data"></output></label>
                <label class="re-input"><span class="mono-data muted">Altitude <i>h</i></span><input type="range" min="0" max="150" step="5" value="0"><output class="mono-data"></output></label>
            </div>
            <dl class="cells re-values">
                <div><dt class="mono-data muted">ρ density</dt><dd class="mono-data" data-out="rho"></dd></div>
                <div><dt class="mono-data muted">μ viscosity</dt><dd class="mono-data" data-out="mu"></dd></div>
                <div><dt class="mono-data muted">c chord</dt><dd class="mono-data">${WING_CHORD.toFixed(3)} m</dd></div>
                <div class="re-total"><dt class="mono-data muted">Re</dt><dd class="mono-data" data-out="re" aria-live="polite"></dd></div>
            </dl>`,
            "Reynolds number of the Gen X wing, ISA standard atmosphere");

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
        let figNo = 0;
        proj.text.forEach(item => {
            if (item.heading) {
                const h = document.createElement("h3");
                h.className = "subhead";
                h.textContent = item.heading;
                descContainer.appendChild(h);
                return;
            }
            if (item.figure) {
                const fig = figures[item.figure]();
                fig.querySelector("figcaption").prepend(`Fig. ${++figNo} — `);
                descContainer.appendChild(fig);
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