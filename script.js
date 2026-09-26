function startLab() {
    enterAircraftLab();
}

function enterAircraftLab(event) {
    if (event) {
        event.preventDefault();
    }

    document.getElementById("aircraft").scrollIntoView({
        behavior: "smooth"
    });

    if (!walkaroundIntroSeen) {
        walkaroundIntroSeen = true;
        document.getElementById("walkaroundIntro").hidden = false;
        document.body.classList.add("walkaround-intro-open");
        document.getElementById("walkaroundIntroStart").focus({ preventScroll: true });
    }
}

function setFlightMode(mode) {
    const isNight = mode === "night";
    const visual = document.getElementById("aircraftVisual");

    visual.classList.toggle("night-mode", isNight);
    document.getElementById("dayModeButton").classList.toggle("is-active", !isNight);
    document.getElementById("dayModeButton").setAttribute("aria-pressed", String(!isNight));
    document.getElementById("nightModeButton").classList.toggle("is-active", isNight);
    document.getElementById("nightModeButton").setAttribute("aria-pressed", String(isNight));
}

const walkaroundSteps = [
    {
        label: "NOSE / COCKPIT",
        inspected: "COCKPIT",
        hotspot: ".hotspot-cockpit",
        system: 2,
        target: "#aircraft-cockpit",
        description: "Check the cockpit glazing for clear visibility and inspect the forward fuselage for visible damage."
    },
    {
        label: "FUSELAGE",
        inspected: "FUSELAGE",
        hotspot: ".hotspot-cockpit",
        system: 2,
        target: ".fuselage",
        description: "Scan the fuselage skin and doors for damage, loose panels, or other visible irregularities."
    },
    {
        label: "MAIN WING",
        inspected: "MAIN WING",
        hotspot: ".hotspot-wing",
        system: 0,
        target: "#aircraft-wing",
        description: "Inspect the wing surfaces and leading edges, and check that visible control surfaces appear unobstructed."
    },
    {
        label: "TURBOFAN ENGINE",
        inspected: "TURBOFAN ENGINE",
        hotspot: ".hotspot-engine",
        system: 1,
        target: ".aircraft-engine",
        description: "Check the engine nacelles and visible intake areas for obstruction, leaks, or apparent damage."
    },
    {
        label: "TAIL",
        inspected: "TAIL",
        hotspot: ".hotspot-tail",
        system: 3,
        target: ".tail-fin",
        description: "Inspect the vertical tail and rudder area for visible damage and unobstructed movement."
    },
    {
        label: "HORIZONTAL STABILIZER",
        inspected: "HORIZONTAL STABILIZER",
        hotspot: ".hotspot-tail",
        system: 3,
        target: ".horizontal-tail",
        description: "Check both horizontal stabilizer surfaces and elevator areas for visible damage or obstruction."
    },
    {
        label: "LANDING GEAR",
        inspected: "LANDING GEAR",
        hotspot: ".hotspot-landing",
        system: 4,
        target: ".landing-gear",
        description: "Inspect the nose and main landing gear, tires, and visible struts for damage or obstruction."
    }
];

let walkaroundIntroSeen = false;
let walkaroundActive = false;
let walkaroundStepIndex = 0;
let walkaroundStepInspected = false;

document.querySelectorAll("#aircraftVisual .hotspot").forEach(hotspot => {
    hotspot.dataset.originalLabel = hotspot.querySelector(".hotspot-label").textContent;
});

function beginWalkaround() {
    document.getElementById("walkaroundIntro").hidden = true;
    document.body.classList.remove("walkaround-intro-open");
    walkaroundActive = true;
    walkaroundStepIndex = 0;
    walkaroundStepInspected = false;
    document.body.classList.add("walkaround-active");
    document.getElementById("walkaroundHud").hidden = false;
    renderWalkaroundStep();
}

function skipWalkaroundIntro() {
    document.getElementById("walkaroundIntro").hidden = true;
    document.body.classList.remove("walkaround-intro-open");
}

function renderWalkaroundStep() {
    const step = walkaroundSteps[walkaroundStepIndex];
    const visual = document.getElementById("aircraftVisual");

    visual.querySelectorAll(".hotspot").forEach(hotspot => {
        hotspot.classList.remove("walkaround-hotspot-active");
        hotspot.querySelector(".hotspot-label").textContent =
            hotspot.dataset.originalLabel;
    });
    visual.querySelectorAll(".walkaround-highlight").forEach(part => {
        part.classList.remove("walkaround-highlight");
    });
    visual.classList.remove(...Array.from(visual.classList).filter(className => className.startsWith("walkaround-step-")));
    visual.classList.add(`walkaround-step-${walkaroundStepIndex}`);

    const activeHotspot = visual.querySelector(step.hotspot);
    activeHotspot.classList.add("walkaround-hotspot-active");
    activeHotspot.querySelector(".hotspot-label").textContent = step.label;

    visual.querySelectorAll(step.target).forEach(part => {
        part.classList.add("walkaround-highlight");
    });

    document.getElementById("walkaroundCounter").textContent =
        `WALKAROUND ${String(walkaroundStepIndex + 1).padStart(2, "0")} / 07`;
    document.getElementById("walkaroundCount").textContent =
        `SYSTEMS INSPECTED: ${walkaroundStepIndex + (walkaroundStepInspected ? 1 : 0)} / 7`;
    document.getElementById("walkaroundTarget").textContent = step.label;
    document.getElementById("walkaroundGuidance").hidden = walkaroundStepInspected;
    document.getElementById("walkaroundConfirmation").hidden = !walkaroundStepInspected;
    document.getElementById("walkaroundComplete").hidden = true;
    document.getElementById("walkaroundExit").hidden = false;
}

function inspectWalkaroundStep(hotspot) {
    const step = walkaroundSteps[walkaroundStepIndex];

    if (!walkaroundActive || walkaroundStepInspected ||
        hotspot !== document.querySelector(".walkaround-hotspot-active")) {
        return;
    }

    walkaroundStepInspected = true;
    document.getElementById("walkaroundCount").textContent =
        `SYSTEMS INSPECTED: ${walkaroundStepIndex + 1} / 7`;
    document.getElementById("progressText").textContent =
        `SYSTEMS INSPECTED: ${walkaroundStepIndex + 1} / 7`;
    document.getElementById("progressBar").style.width =
        `${((walkaroundStepIndex + 1) / walkaroundSteps.length) * 100}%`;
    document.getElementById("walkaroundGuidance").hidden = true;
    document.getElementById("walkaroundConfirmation").hidden = false;
    document.getElementById("walkaroundConfirmationTitle").textContent =
        `\u2713 ${step.inspected} INSPECTED`;
    document.getElementById("walkaroundDescription").textContent = step.description;

    if (walkaroundStepIndex === walkaroundSteps.length - 1) {
        document.getElementById("walkaroundConfirmation").hidden = true;
        document.getElementById("walkaroundComplete").hidden = false;
        document.getElementById("walkaroundExit").hidden = true;
        return;
    }

    document.getElementById("walkaroundNextButton").textContent =
        `NEXT: ${walkaroundSteps[walkaroundStepIndex + 1].label} \u2192`;
}

function advanceWalkaround() {
    if (!walkaroundActive || !walkaroundStepInspected ||
        walkaroundStepIndex >= walkaroundSteps.length - 1) {
        return;
    }

    walkaroundStepIndex++;
    walkaroundStepInspected = false;
    renderWalkaroundStep();
}

function finishWalkaround() {
    walkaroundActive = false;
    document.body.classList.remove("walkaround-active");
    document.getElementById("walkaroundHud").hidden = true;
    const visual = document.getElementById("aircraftVisual");

    visual.querySelectorAll(".walkaround-highlight").forEach(part => {
        part.classList.remove("walkaround-highlight");
    });
    visual.querySelectorAll(".walkaround-hotspot-active").forEach(hotspot => {
        hotspot.classList.remove("walkaround-hotspot-active");
    });
    visual.querySelectorAll(".hotspot").forEach(hotspot => {
        hotspot.querySelector(".hotspot-label").textContent = hotspot.dataset.originalLabel;
    });
    visual.classList.remove(...Array.from(visual.classList).filter(className => className.startsWith("walkaround-step-")));
}

function exitWalkaround() {
    finishWalkaround();
    restoreSystemsProgress();
}

function enterAircraftSystems() {
    finishWalkaround();
    restoreSystemsProgress();
    document.getElementById("aircraft").scrollIntoView({ behavior: "smooth" });
}

function restoreSystemsProgress() {
    const count = exploredSystems.size;
    document.getElementById("progressText").textContent =
        count === 5 ? "5 / 5 SYSTEMS COMPLETE" : `${count} / 5 SYSTEMS EXPLORED`;
    document.getElementById("progressBar").style.width = `${(count / 5) * 100}%`;
}

function showPart(title, description) {
    document.getElementById("partTitle").textContent = title;
    document.getElementById("partDescription").textContent = description;
}

function showAircraftInfo() {
    document.getElementById("partTitle").textContent = "SAEL-X01 Aircraft Overview";
    document.getElementById("systemNumber").textContent = "00";
    document.getElementById("systemCounter").textContent = "AIRCRAFT OVERVIEW";
    document.getElementById("studyPageProgress").textContent = "AIRCRAFT OVERVIEW";
    document.getElementById("systemNavigation").hidden = true;
    document.getElementById("systemHint").hidden = true;
    document.getElementById("partDescription").innerHTML = `
        <div class="aircraft-overview">
            <p class="lesson-intro">
                The SAEL-X01 is a conceptual passenger jet created for this interactive learning lab.
            </p>
            <ul>
                <li><strong>Configuration:</strong> Twin-engine jet with swept wings</li>
                <li><strong>Propulsion:</strong> Two turbofan engines</li>
                <li><strong>Flight controls:</strong> Ailerons, elevator and rudder</li>
                <li><strong>Ground support:</strong> Retractable tricycle landing gear</li>
            </ul>
            <p class="hint">CONCEPT AIRCRAFT · NO REAL-WORLD PERFORMANCE DATA</p>
        </div>
    `;
    openStudyPage("SAEL-X01 AIRCRAFT OVERVIEW");
}

function answerQuiz(correct) {
    const result = document.getElementById("quizResult");

    if (correct) {
        result.textContent = "Correct — engines produce thrust.";
    } else {
        result.textContent = "Not quite. Think about what moves the aircraft forward.";
    }
}
function showEngineLesson() {

    document.getElementById("partTitle").textContent =
        "Turbofan Engine";

    document.getElementById("partDescription").innerHTML = `

        <div class="engine-lesson">

            <p class="lesson-intro">
                The engine is the aircraft's propulsion system.
                It converts the chemical energy of fuel into
                mechanical energy and then into thrust, allowing
                the aircraft to move through the air.
            </p>

            <div class="engine-power-console" id="enginePowerConsole">
                <div class="engine-console-main">
                    <div class="engine-status-indicator" id="engineStatusIndicator" aria-hidden="true"></div>
                    <div class="engine-status-copy">
                        <span>ENGINE STATUS</span>
                        <strong id="engineStatusValue">OFF</strong>
                    </div>
                    <div class="engine-turbine" aria-hidden="true">
                        <div class="engine-turbine-fan"></div>
                    </div>
                </div>
                <div class="engine-run-readout" id="engineRunReadout" hidden>
                    <div class="engine-n1"><span>N1</span><strong>72%</strong></div>
                    <span class="engine-normal"><i></i>THRUST AVAILABLE</span>
                    <span class="engine-normal"><i></i>ENGINE NORMAL</span>
                </div>
                <div class="engine-console-actions">
                    <span class="engine-simulation-note">SIMULATED VALUES · NOT AIRCRAFT TELEMETRY</span>
                    <button class="engine-power-button" id="enginePowerButton" onclick="toggleEnginePower()">START ENGINE</button>
                </div>
            </div>

            <h4>01 — What does an engine do?</h4>

            <p>
                A modern airliner commonly uses a
                <strong>turbofan engine</strong>.
                Its main job is to produce <strong>thrust</strong>.
                Thrust is the forward force that pushes the aircraft
                through the air.
            </p>

            <h4>02 — The five main stages</h4>

            <div class="engine-flow">

    <button class="engine-stage" onclick="showEngineStage('intake')">
        <span>01</span>
        <strong>INTAKE</strong>
        <small>Air enters</small>
    </button>

    <div class="flow-arrow">→</div>

    <button class="engine-stage" onclick="showEngineStage('compressor')">
        <span>02</span>
        <strong>COMPRESSOR</strong>
        <small>Air is compressed</small>
    </button>

    <div class="flow-arrow">→</div>

    <button class="engine-stage" onclick="showEngineStage('combustion')">
        <span>03</span>
        <strong>COMBUSTION</strong>
        <small>Energy is released</small>
    </button>

    <div class="flow-arrow">→</div>

    <button class="engine-stage" onclick="showEngineStage('turbine')">
        <span>04</span>
        <strong>TURBINE</strong>
        <small>Energy drives rotation</small>
    </button>

    <div class="flow-arrow">→</div>

    <button class="engine-stage" onclick="showEngineStage('exhaust')">
        <span>05</span>
        <strong>EXHAUST</strong>
        <small>Air accelerates</small>
    </button>

</div>

<div id="engineStageDetail" class="engine-stage-detail">

    <span class="tag">ENGINE FLOW</span>

    <h4>SELECT A STAGE</h4>

    <p>
        Select a stage above to explore what happens
        inside a turbofan engine.
    </p>

</div>

            <h4>03 — Why is it called a turbofan?</h4>

            <p>
                The name combines two important components:
                <strong>turbine</strong> and <strong>fan</strong>.
                The turbine provides the power needed to rotate the
                fan, while the fan moves a large mass of air.
            </p>

            <h4>04 — Bypass air</h4>

            <p>
                In a high-bypass turbofan, most of the air entering
                the front of the engine travels around the engine core
                rather than through the combustion chamber.
                This is called <strong>bypass air</strong>.
            </p>

            <p>
                Moving a large amount of air efficiently is one reason
                turbofans are widely used on modern passenger aircraft.
            </p>

            <h4>05 — How does thrust happen?</h4>

            <p>
                The engine accelerates air backward. According to
                Newton's third law, this results in a force in the
                opposite direction — forward thrust.
            </p>

            <div class="engineering-note">

                <strong>ENGINEERING CONNECTION</strong>

                <p>
                    Engineers study airflow, pressure, temperature,
                    combustion, materials, vibration and efficiency
                    when designing and improving aircraft engines.
                </p>

            </div>

            <h4>06 — Quick facts</h4>

            <ul>
                <li>Aircraft engines are propulsion systems.</li>
                <li>Turbofans are common on modern airliners.</li>
                <li>The compressor increases air pressure.</li>
                <li>The combustion chamber releases chemical energy.</li>
                <li>The turbine extracts energy from hot gases.</li>
                <li>The fan and exhaust contribute to producing thrust.</li>
            </ul>

        </div>
    `;
    updateEnginePowerUI();
}

let enginePowerState = "OFF";
let engineStartTimer = null;

function updateEnginePowerUI() {
    document.body.classList.toggle("engine-power-starting", enginePowerState === "STARTING");
    document.body.classList.toggle("engine-power-running", enginePowerState === "RUNNING");

    const consolePanel = document.getElementById("enginePowerConsole");

    if (!consolePanel) {
        return;
    }

    const status = document.getElementById("engineStatusValue");
    const button = document.getElementById("enginePowerButton");

    status.textContent = enginePowerState;
    button.textContent = enginePowerState === "RUNNING" ? "SHUT DOWN ENGINE" :
        enginePowerState === "STARTING" ? "STARTING..." : "START ENGINE";
    button.disabled = enginePowerState === "STARTING";
    document.getElementById("engineRunReadout").hidden = enginePowerState !== "RUNNING";
    consolePanel.classList.toggle("is-starting", enginePowerState === "STARTING");
    consolePanel.classList.toggle("is-running", enginePowerState === "RUNNING");
}

function toggleEnginePower() {
    if (enginePowerState === "STARTING") {
        return;
    }

    if (enginePowerState === "RUNNING") {
        clearTimeout(engineStartTimer);
        enginePowerState = "OFF";
        updateEnginePowerUI();
        return;
    }

    enginePowerState = "STARTING";
    updateEnginePowerUI();

    engineStartTimer = setTimeout(() => {
        enginePowerState = "RUNNING";
        updateEnginePowerUI();
    }, 1500);
}

let takeoffRunning = false;
let takeoffTimers = [];

function startTakeoffSimulation() {
    if (takeoffRunning) {
        return;
    }

    takeoffRunning = true;

    const visual = document.getElementById("aircraftVisual");
    const overlay = document.getElementById("takeoffOverlay");
    const message = document.getElementById("takeoffMessage");
    const cruiseMode = document.getElementById("takeoffCruiseMode");
    const button = document.getElementById("takeoffButton");

    overlay.hidden = false;
    message.textContent = "FLIGHT SEQUENCE INITIALIZING...";
    cruiseMode.hidden = true;
    button.disabled = true;
    visual.classList.add("takeoff-active");

    const setStage = (text, className) => {
        message.textContent = text;
        visual.classList.add(className);
    };

    takeoffTimers = [
        setTimeout(() => setStage("ENGINES POWERING UP...", "takeoff-engine-starting"), 700),
        setTimeout(() => setStage("ACCELERATING ON RUNWAY...", "takeoff-accelerating"), 1500),
        setTimeout(() => setStage("ROTATING / LIFTOFF...", "takeoff-liftoff"), 2650),
        setTimeout(() => setStage("CLIMBING...", "takeoff-cruise"), 3550),
        setTimeout(() => {
            message.textContent = "TAKEOFF COMPLETE";
            cruiseMode.hidden = false;
            visual.classList.add("takeoff-complete");
        }, 4550),
        setTimeout(finishTakeoffSimulation, 5800)
    ];
}

function finishTakeoffSimulation() {
    takeoffTimers.forEach(clearTimeout);
    takeoffTimers = [];
    takeoffRunning = false;

    document.getElementById("aircraftVisual").classList.remove(
        "takeoff-active",
        "takeoff-engine-starting",
        "takeoff-accelerating",
        "takeoff-liftoff",
        "takeoff-cruise",
        "takeoff-complete"
    );
    document.getElementById("takeoffOverlay").hidden = true;
    document.getElementById("takeoffCruiseMode").hidden = true;
    document.getElementById("takeoffButton").disabled = false;
}
 
function showTailLesson() {

    document.getElementById("partTitle").textContent =
    "Tail & Stability";

document.getElementById("partDescription").innerHTML = `

    <div class="tail-lesson">

        <p class="lesson-intro">
            The tail is essential for aircraft stability and control.
            It helps the aircraft maintain its orientation and allows
            the pilot to control pitch and yaw.
        </p>

        <h4>01 — The three axes of flight</h4>

        <p>
            An aircraft can rotate around three principal axes:
            <strong>roll, pitch and yaw</strong>.
        </p>

        <div class="tail-controls">

            <button class="tail-control"
                onclick="showTailDetail('pitch')">

                <span>01</span>
                <strong>PITCH</strong>
                <small>Horizontal axis</small>

            </button>

            <button class="tail-control"
                onclick="showTailDetail('yaw')">

                <span>02</span>
                <strong>YAW</strong>
                <small>Vertical axis</small>

            </button>

            <button class="tail-control"
                onclick="showTailDetail('stability')">

                <span>03</span>
                <strong>STABILITY</strong>
                <small>Aircraft balance</small>

            </button>

        </div>

        <div id="tailDetail" class="tail-detail">

            <span class="tag">TAIL SYSTEM</span>

            <h4>SELECT A FUNCTION</h4>

            <p>
                Select an item above to explore how the tail
                contributes to aircraft control and stability.
            </p>

        </div>

        <h4>02 — Vertical stabilizer</h4>

        <div class="tail-card">

            <strong>VERTICAL STABILIZER</strong>

            <p>
                The vertical stabilizer is the fixed vertical surface
                on the tail. It helps provide directional stability
                and resists unwanted yawing motion.
            </p>

        </div>

        <h4>03 — Rudder</h4>

        <div class="tail-card">

            <strong>RUDDER</strong>

            <p>
                The rudder is the movable control surface attached to
                the vertical stabilizer. It primarily controls yaw.
            </p>

        </div>

        <h4>04 — Horizontal stabilizer</h4>

        <div class="tail-card">

            <strong>HORIZONTAL STABILIZER</strong>

            <p>
                The horizontal stabilizer is the fixed horizontal
                surface at the tail. It contributes to longitudinal
                stability and helps the aircraft maintain its pitch
                attitude.
            </p>

        </div>

        <h4>05 — Elevator</h4>

        <div class="tail-card">

            <strong>ELEVATOR</strong>

            <p>
                The elevator is a movable control surface attached to
                the horizontal stabilizer. It primarily controls
                pitch.
            </p>

        </div>

        <div class="engineering-note">

            <strong>ENGINEERING CONNECTION</strong>

            <p>
                Tail design involves aerodynamics, stability,
                control systems, structural loads and materials.
                Engineers must ensure the aircraft remains stable
                while still responding effectively to pilot inputs.
            </p>

        </div>

        <h4>06 — Quick facts</h4>

        <ul>

            <li>
                The rudder primarily controls yaw.
            </li>

            <li>
                The elevator primarily controls pitch.
            </li>

            <li>
                The vertical stabilizer contributes to directional
                stability.
            </li>

            <li>
                The horizontal stabilizer contributes to longitudinal
                stability.
            </li>

            <li>
                Aircraft stability and control are closely connected.
            </li>

        </ul>

    </div>
`;
}
function showLandingGearLesson() {
document.getElementById("partTitle").textContent =
    "Landing Gear";

document.getElementById("partDescription").innerHTML = `

    <div class="gear-lesson">

        <p class="lesson-intro">
            Landing gear is the aircraft's ground-support system.
            It carries the aircraft's weight while it is on the ground,
            absorbs loads during landing and allows the aircraft to
            taxi, turn and stop safely.
        </p>

        <h4>01 — Explore the landing gear</h4>

        <div class="gear-controls">

            <button class="gear-control"
                onclick="showGearDetail('main')">

                <span>01</span>
                <strong>MAIN GEAR</strong>
                <small>Primary load support</small>

            </button>

            <button class="gear-control"
                onclick="showGearDetail('nose')">

                <span>02</span>
                <strong>NOSE GEAR</strong>
                <small>Steering & support</small>

            </button>

            <button class="gear-control"
                onclick="showGearDetail('shock')">

                <span>03</span>
                <strong>SHOCK ABSORPTION</strong>
                <small>Landing loads</small>

            </button>

            <button class="gear-control"
                onclick="showGearDetail('retraction')">

                <span>04</span>
                <strong>RETRACTION</strong>
                <small>Reduce drag</small>

            </button>

        </div>

        <div id="gearDetail" class="gear-detail">

            <span class="tag">LANDING GEAR SYSTEM</span>

            <h4>SELECT A COMPONENT</h4>

            <p>
                Select a component above to explore how it works.
            </p>

        </div>

        <h4>02 — Main landing gear</h4>

        <div class="gear-card">

            <strong>MAIN GEAR</strong>

            <p>
                The main landing gear carries most of the aircraft's
                weight during ground operations. It is designed to
                withstand significant vertical and horizontal loads.
            </p>

        </div>

        <h4>03 — Nose landing gear</h4>

        <div class="gear-card">

            <strong>NOSE GEAR</strong>

            <p>
                The nose gear supports the front of the aircraft.
                On many aircraft it also provides directional steering
                while taxiing.
            </p>

        </div>

        <h4>04 — Shock absorption</h4>

        <div class="gear-card">

            <strong>SHOCK STRUT</strong>

            <p>
                Landing gear uses shock-absorbing systems to reduce
                the loads transmitted to the aircraft structure during
                landing and ground operations.
            </p>

        </div>

        <h4>05 — Retraction system</h4>

        <div class="gear-card">

            <strong>GEAR RETRACTION</strong>

            <p>
                Many aircraft retract their landing gear after
                takeoff. Retracting the gear reduces aerodynamic drag
                and improves efficiency during flight.
            </p>

        </div>

        <h4>06 — Braking</h4>

        <div class="gear-card">

            <strong>WHEEL BRAKES</strong>

            <p>
                Braking systems allow the aircraft to slow down after
                landing and during ground operations. Modern aircraft
                may use sophisticated hydraulic or electrically
                controlled braking systems.
            </p>

        </div>

        <div class="engineering-note">

            <strong>ENGINEERING CONNECTION</strong>

            <p>
                Landing gear engineers work with structural loads,
                hydraulics, materials, wheels, brakes, shock absorbers
                and mechanical systems. The system must be strong,
                reliable and as lightweight as practical.
            </p>

        </div>

        <h4>07 — Quick facts</h4>

        <ul>

            <li>
                Landing gear supports the aircraft on the ground.
            </li>

            <li>
                Main gear carries most of the aircraft's weight.
            </li>

            <li>
                Nose gear helps support and steer the aircraft.
            </li>

            <li>
                Shock absorbers reduce landing loads.
            </li>

            <li>
                Retracting the gear can reduce aerodynamic drag.
            </li>

            <li>
                Wheel brakes help slow the aircraft after landing.
            </li>

        </ul>

    </div>
`;
}
function showWingLesson() {

    document.getElementById("partTitle").textContent =
        "Aircraft Wing";

    document.getElementById("partDescription").innerHTML = `

        <div class="wing-lesson">

            <p class="lesson-intro">
                The wing is one of the most important aerodynamic
                components of an aircraft. It produces lift, carries
                fuel and can contain important flight-control surfaces.
            </p>

            <h4>01 — What is the wing?</h4>

            <p>
                An aircraft wing is an aerodynamic structure designed
                to interact with moving air. Its shape and angle allow
                it to generate aerodynamic forces that help support
                the aircraft in flight.
            </p>

            <h4>02 — How does a wing produce lift?</h4>

            <p>
                As the aircraft moves forward, air flows around the
                wing. The wing's geometry and angle of attack influence
                the pressure distribution and airflow around it.
                The resulting aerodynamic force has a component
                perpendicular to the airflow called
                <strong>lift</strong>.
            </p>

            <h4>03 — Main parts of a wing</h4>
<div class="wing-component" onclick="showWingDetail('root')">
    <span class="component-number">01</span>
    <strong>WING ROOT</strong>
    <p>Structural connection between the wing and fuselage.</p>
</div>

<div class="wing-component" onclick="showWingDetail('tip')">
    <span class="component-number">02</span>
    <strong>WINGTIP</strong>
    <p>The outer end of the wing.</p>
</div>

<div class="wing-component" onclick="showWingDetail('aileron')">
    <span class="component-number">03</span>
    <strong>AILERON</strong>
    <p>Controls the aircraft's roll.</p>
</div>

<div class="wing-component" onclick="showWingDetail('flaps')">
    <span class="component-number">04</span>
    <strong>FLAPS</strong>
    <p>High-lift devices used during takeoff and landing.</p>
</div>

<div class="wing-component" onclick="showWingDetail('spoilers')">
    <span class="component-number">05</span>
    <strong>SPOILERS</strong>
    <p>Panels that modify airflow and reduce lift.</p>
</div>

<div id="wingDetail" class="wing-detail">
    <span class="tag">SELECT A COMPONENT</span>
    <p>
        Click one of the wing components above to explore
        its engineering function.
    </p>
</div>

            <h4>04 — Wing structure</h4>

            <p>
                Inside a wing are structural elements such as
                <strong>spars</strong> and <strong>ribs</strong>.
                These components help the wing withstand aerodynamic
                forces and distribute loads through the aircraft.
            </p>

            <h4>05 — Wing and fuel</h4>

            <p>
                Many aircraft store a significant amount of fuel
                inside tanks located within the wings. This arrangement
                can help manage the aircraft's mass distribution.
            </p>

            <div class="engineering-note">

                <strong>ENGINEERING CONNECTION</strong>

                <p>
                    Aerospace engineers design wings by studying
                    aerodynamics, structures, materials, loads,
                    stability, manufacturing and fuel systems.
                </p>

            </div>

            <h4>06 — Quick facts</h4>

            <ul>
                <li>Wings generate lift.</li>
                <li>Ailerons primarily control roll.</li>
                <li>Flaps change the wing's aerodynamic characteristics.</li>
                <li>Spars and ribs provide structural support.</li>
                <li>Many aircraft store fuel inside their wings.</li>
            </ul>

        </div>
    `;
}
function showCockpitLesson() {

    document.getElementById("partTitle").textContent =
    "Aircraft Cockpit";

document.getElementById("partDescription").innerHTML = `

    <div class="cockpit-lesson">

        <p class="lesson-intro">
            The cockpit is the aircraft's command and information
            center. It brings together flight instruments, controls,
            communication, navigation and aircraft monitoring systems.
        </p>

        <h4>01 — Flight instruments</h4>

        <p>
            Pilots need continuous information about the aircraft's
            motion and position. Modern cockpits combine many
            instruments into electronic displays called
            <strong>flight displays</strong>.
        </p>

        <div class="cockpit-instruments">

            <button class="cockpit-instrument"
                onclick="showCockpitInstrument('attitude')">

                <span>01</span>
                <strong>ATTITUDE</strong>
                <small>Pitch & bank</small>

            </button>

            <button class="cockpit-instrument"
                onclick="showCockpitInstrument('airspeed')">

                <span>02</span>
                <strong>AIRSPEED</strong>
                <small>Speed through air</small>

            </button>

            <button class="cockpit-instrument"
                onclick="showCockpitInstrument('altitude')">

                <span>03</span>
                <strong>ALTITUDE</strong>
                <small>Vertical position</small>

            </button>

            <button class="cockpit-instrument"
                onclick="showCockpitInstrument('heading')">

                <span>04</span>
                <strong>HEADING</strong>
                <small>Direction</small>

            </button>

        </div>

        <div id="cockpitDetail" class="cockpit-detail">

            <span class="tag">COCKPIT SYSTEM</span>

            <h4>SELECT AN INSTRUMENT</h4>

            <p>
                Select an instrument above to explore what it tells
                the flight crew.
            </p>

        </div>


        <h4>02 — Flight controls</h4>

        <p>
            The aircraft can rotate around three principal axes:
            <strong>roll, pitch and yaw</strong>.
        </p>

        <div class="cockpit-control">

            <strong>ROLL — AILERONS</strong>

            <p>
                Ailerons move in opposite directions on the wings.
                They change the lift on each side of the aircraft,
                producing a rolling motion.
            </p>

        </div>

        <div class="cockpit-control">

            <strong>PITCH — ELEVATOR</strong>

            <p>
                The elevator is located on the horizontal tail.
                Moving it changes the aerodynamic force on the tail
                and controls the aircraft's pitch.
            </p>

        </div>

        <div class="cockpit-control">

            <strong>YAW — RUDDER</strong>

            <p>
                The rudder is located on the vertical tail.
                It controls rotation around the aircraft's vertical
                axis, known as yaw.
            </p>

        </div>


        <h4>03 — Avionics</h4>

        <p>
            <strong>Avionics</strong> refers to the electronic systems
            used aboard an aircraft. These systems support navigation,
            communication, flight information and monitoring.
        </p>

        <div class="cockpit-control">

            <strong>COMMUNICATION</strong>

            <p>
                Communication systems allow the flight crew to
                exchange information with air traffic control and
                other relevant stations.
            </p>

        </div>

        <div class="cockpit-control">

            <strong>NAVIGATION</strong>

            <p>
                Navigation systems provide information about the
                aircraft's position and help guide it along a planned
                route.
            </p>

        </div>

        <div class="cockpit-control">

            <strong>AIRCRAFT MONITORING</strong>

            <p>
                Electronic systems monitor important aircraft
                parameters and provide warnings when abnormal
                conditions are detected.
            </p>

        </div>


        <h4>04 — Flight Management System</h4>

        <p>
            Many modern aircraft use a
            <strong>Flight Management System (FMS)</strong>.
            It helps the crew manage navigation, flight planning
            and performance information.
        </p>


        <div class="engineering-note">

            <strong>ENGINEERING CONNECTION</strong>

            <p>
                Designing a cockpit requires knowledge of aerospace
                engineering, electronics, software, control systems,
                sensors, human factors and safety.
            </p>

        </div>


        <h4>05 — Quick facts</h4>

        <ul>

            <li>
                The cockpit is the aircraft's control center.
            </li>

            <li>
                Roll is primarily controlled by the ailerons.
            </li>

            <li>
                Pitch is primarily controlled by the elevator.
            </li>

            <li>
                Yaw is primarily controlled by the rudder.
            </li>

            <li>
                Avionics provide electronic navigation,
                communication and monitoring functions.
            </li>

        </ul>

    </div>
`;
}
const hotspots = document.querySelectorAll(".hotspot");

hotspots.forEach(hotspot => {

    hotspot.addEventListener("mouseenter", () => {

        const part = hotspot.dataset.part;

        if (part === "wing") {
            document
                .getElementById("aircraft-wing")
                .classList.add("component-highlight");
        }

        if (part === "engine") {
            document
                .querySelectorAll(".aircraft-engine")
                .forEach(engine =>
                    engine.classList.add("component-highlight")
                );
        }

        if (part === "cockpit") {
            document
                .getElementById("aircraft-cockpit")
                .classList.add("component-highlight");
        }

        if (part === "tail") {
            document
                .getElementById("aircraft-tail")
                .classList.add("component-highlight");
        }

        if (part === "landing") {
            document
                .querySelectorAll(".landing-gear")
                .forEach(gear =>
                    gear.classList.add("component-highlight")
                );
        }

    });

    hotspot.addEventListener("mouseleave", () => {

        document
            .querySelectorAll(".component-highlight")
            .forEach(part =>
                part.classList.remove("component-highlight")
            );

    });
});
let currentSystem = 0;

const systems = [
    showWingLesson,
    showEngineLesson,
    showCockpitLesson,
    showTailLesson,
    showLandingGearLesson
];

let studyReturnPosition = 0;
let studyReturnFocus = null;

document.getElementById("studyPageContent").appendChild(
    document.getElementById("infoPanel")
);

function openStudyPage(title) {
    const studyPage = document.getElementById("studyPage");

    if (studyPage.hidden) {
        studyReturnPosition = window.scrollY;
        studyReturnFocus = document.activeElement;
    }

    document.getElementById("studyPageTitle").textContent =
        title || document.getElementById("partTitle").textContent;
    studyPage.hidden = false;
    studyPage.scrollTop = 0;
    document.body.classList.add("study-page-open");
    studyPage.querySelector(".study-page-back").focus({ preventScroll: true });
}

function closeStudyPage() {
    const studyPage = document.getElementById("studyPage");

    if (studyPage.hidden) {
        return;
    }

    studyPage.hidden = true;
    document.body.classList.remove("study-page-open");
    window.scrollTo({ top: studyReturnPosition, behavior: "smooth" });

    if (studyReturnFocus && typeof studyReturnFocus.focus === "function") {
        studyReturnFocus.focus({ preventScroll: true });
    }
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeStudyPage();
    }
});

function openSystem(index, sourceHotspot) {
    if (walkaroundActive) {
        inspectWalkaroundStep(sourceHotspot);
        return;
    }

    if (index < 0 || index >= systems.length) {
        return;
    }

    currentSystem = index;

    systems[currentSystem]();

    updateSystemNavigation();
    openStudyPage();

    if (typeof trackSystem === "function") {
        trackSystem(index);
    }
}

function nextSystem() {
    if (currentSystem < systems.length - 1) {
        currentSystem++;
        systems[currentSystem]();
        updateSystemNavigation();

        if (typeof trackSystem === "function") {
            trackSystem(currentSystem);
        }
    }
}

function previousSystem() {
    if (currentSystem > 0) {
        currentSystem--;
        systems[currentSystem]();
        updateSystemNavigation();

        if (typeof trackSystem === "function") {
            trackSystem(currentSystem);
        }
    }
}

function updateSystemNavigation() {
    document.getElementById("systemNavigation").hidden = false;
    document.getElementById("systemHint").hidden = false;
    document.getElementById("systemNumber").textContent =
        String(currentSystem + 1).padStart(2, "0");

    document.getElementById("systemCounter").textContent =
        `SYSTEM ${currentSystem + 1} / ${systems.length}`;
    document.getElementById("studyPageTitle").textContent =
        document.getElementById("partTitle").textContent;
    document.getElementById("studyPageProgress").textContent =
        `SYSTEM ${currentSystem + 1} / ${systems.length}`;
}
function showWingDetail(component) {

    const detail = document.getElementById("wingDetail");

    const information = {

        root: {
            title: "WING ROOT",
            text: "The wing root is where the wing connects to the fuselage. It transfers aerodynamic and structural loads between the wing and the aircraft body."
        },

        tip: {
            title: "WINGTIP",
            text: "The wingtip is the outermost part of the wing. Its shape influences airflow and induced drag. Modern aircraft may use winglets or other tip devices to improve aerodynamic efficiency."
        },

        aileron: {
            title: "AILERON",
            text: "Ailerons are movable control surfaces located toward the outer portions of the wings. They primarily control roll by changing the lift produced by each wing."
        },

        flaps: {
            title: "FLAPS",
            text: "Flaps are high-lift devices that extend from the wing during certain phases of flight. They allow the aircraft to generate the required aerodynamic forces at lower speeds."
        },

        spoilers: {
            title: "SPOILERS",
            text: "Spoilers are panels on the upper surface of the wing that disrupt airflow. They can reduce lift and are also used during descent, landing and roll control."
        }

    };

    detail.innerHTML = `
        <span class="tag">COMPONENT ANALYSIS</span>

        <h4>${information[component].title}</h4>

        <p>${information[component].text}</p>
    `;
}
function showEngineStage(stage) {

    const detail = document.getElementById("engineStageDetail");

    const stages = {

        intake: {
            number: "01",
            title: "INTAKE",
            text: "The fan draws a large mass of air into the engine. The incoming airflow is divided between the bypass stream and the engine core."
        },

        compressor: {
            number: "02",
            title: "COMPRESSOR",
            text: "Inside the core, compressor stages progressively increase the pressure of the air. Higher-pressure air allows the combustion process to release energy efficiently."
        },

        combustion: {
            number: "03",
            title: "COMBUSTION",
            text: "Fuel is mixed with compressed air and burned in the combustion chamber. The chemical energy stored in the fuel is converted into thermal energy, producing high-energy gases."
        },

        turbine: {
            number: "04",
            title: "TURBINE",
            text: "The hot gases pass through turbine stages. The turbine extracts part of their energy to drive the compressor and fan through rotating shafts."
        },

        exhaust: {
            number: "05",
            title: "EXHAUST",
            text: "The remaining airflow leaves the engine at high velocity. Accelerating air rearward contributes to the forward thrust that propels the aircraft."
        }

    };

    const selected = stages[stage];

    detail.innerHTML = `
        <span class="tag">STAGE ${selected.number}</span>

        <h4>${selected.title}</h4>

        <p>${selected.text}</p>
    `;
}
function showCockpitInstrument(instrument) {

    const detail = document.getElementById("cockpitDetail");

    const instruments = {

        attitude: {
            title: "ATTITUDE INDICATOR",
            text: "The attitude indicator shows the aircraft's orientation relative to the horizon. It provides information about pitch and bank."
        },

        airspeed: {
            title: "AIRSPEED INDICATOR",
            text: "The airspeed indicator shows the aircraft's speed relative to the surrounding air. Pilots monitor airspeed throughout different phases of flight."
        },

        altitude: {
            title: "ALTIMETER",
            text: "The altimeter indicates altitude using atmospheric pressure. Pilots use it to maintain the required vertical position."
        },

        heading: {
            title: "HEADING INDICATOR",
            text: "The heading indicator shows the direction in which the aircraft is pointing. It is an important part of maintaining and following a planned flight path."
        }

    };

    const selected = instruments[instrument];

    detail.innerHTML = `
        <span class="tag">INSTRUMENT ANALYSIS</span>

        <h4>${selected.title}</h4>

        <p>${selected.text}</p>
    `;
}
function showTailDetail(type) {

    const detail = document.getElementById("tailDetail");

    const information = {

        pitch: {
            title: "PITCH",
            text: "Pitch is the rotation of an aircraft around its lateral axis. The elevator is the primary control surface used to change pitch."
        },

        yaw: {
            title: "YAW",
            text: "Yaw is the rotation of an aircraft around its vertical axis. The rudder is the primary control surface used to control yaw."
        },

        stability: {
            title: "AIRCRAFT STABILITY",
            text: "The tail helps the aircraft resist unwanted changes in attitude and return toward a stable flight condition. Engineers carefully design the tail surfaces to balance stability and controllability."
        }

    };

    const selected = information[type];

    detail.innerHTML = `
        <span class="tag">TAIL ANALYSIS</span>

        <h4>${selected.title}</h4>

        <p>${selected.text}</p>
    `;
}
function showGearDetail(type) {

    const detail = document.getElementById("gearDetail");

    const information = {

        main: {
            title: "MAIN LANDING GEAR",
            text: "The main landing gear carries most of the aircraft's weight. Its structure must withstand landing impacts, braking forces and loads generated while taxiing."
        },

        nose: {
            title: "NOSE LANDING GEAR",
            text: "The nose gear supports the front of the aircraft and usually incorporates a steering mechanism that allows the aircraft to turn while taxiing."
        },

        shock: {
            title: "SHOCK ABSORPTION",
            text: "Shock-absorbing systems reduce the loads produced when the aircraft touches down. This protects both the landing gear and the aircraft structure."
        },

        retraction: {
            title: "RETRACTION SYSTEM",
            text: "After takeoff, many aircraft retract their landing gear into dedicated bays. This reduces aerodynamic drag and improves cruise efficiency."
        }

    };

    const selected = information[type];

    detail.innerHTML = `
        <span class="tag">LANDING GEAR ANALYSIS</span>

        <h4>${selected.title}</h4>

        <p>${selected.text}</p>
    `;
}
const quizQuestions = [

    {
        question: "What is the primary purpose of an aircraft engine?",
        answers: [
            "To generate lift",
            "To produce thrust",
            "To control the landing gear",
            "To control pitch"
        ],
        correct: 1
    },

    {
        question: "Which control surface primarily controls roll?",
        answers: [
            "Rudder",
            "Elevator",
            "Aileron",
            "Flap"
        ],
        correct: 2
    },

    {
        question: "What does the elevator primarily control?",
        answers: [
            "Pitch",
            "Yaw",
            "Roll",
            "Engine temperature"
        ],
        correct: 0
    },

    {
        question: "What is one major purpose of landing gear?",
        answers: [
            "Generate thrust",
            "Support the aircraft on the ground",
            "Generate lift",
            "Control the engine"
        ],
        correct: 1
    },

    {
        question: "What does the vertical stabilizer help provide?",
        answers: [
            "Directional stability",
            "Engine compression",
            "Fuel combustion",
            "Landing braking"
        ],
        correct: 0
    },

    {
        question: "Why are flaps extended during takeoff or landing?",
        answers: [
            "To steer the nose wheel",
            "To cool the engines",
            "To increase lift at lower speeds",
            "To reduce cabin pressure"
        ],
        correct: 2
    },

    {
        question: "Which control surface primarily controls yaw?",
        answers: [
            "Elevator",
            "Rudder",
            "Flap",
            "Spoiler"
        ],
        correct: 1
    },

    {
        question: "What happens when flight spoilers are raised?",
        answers: [
            "The engine produces more thrust",
            "The landing gear retracts",
            "The cabin pressure rises",
            "Lift is reduced and drag increases"
        ],
        correct: 3
    },

    {
        question: "What is the fuselage's primary role?",
        answers: [
            "To house the cabin and connect major aircraft structures",
            "To generate engine thrust",
            "To control yaw by itself",
            "To measure outside air pressure"
        ],
        correct: 0
    },

    {
        question: "What do an aircraft's avionics systems support?",
        answers: [
            "Fuel combustion inside the engine",
            "Wheel rotation during taxi",
            "Navigation, communication and flight monitoring",
            "Wing structural loads only"
        ],
        correct: 2
    },

    {
        question: "What does a pitot tube sense for airspeed measurement?",
        answers: [
            "Cabin temperature",
            "Total air pressure",
            "Fuel quantity",
            "Magnetic heading"
        ],
        correct: 1
    },

    {
        question: "What does a static port measure?",
        answers: [
            "Engine exhaust temperature",
            "Fuel flow rate",
            "Landing gear position",
            "Ambient atmospheric pressure"
        ],
        correct: 3
    },

    {
        question: "In a high-bypass turbofan, where does bypass air flow?",
        answers: [
            "Around the engine core",
            "Through the fuel tanks",
            "Into the passenger cabin",
            "Through the landing gear"
        ],
        correct: 0
    },

    {
        question: "What happens to air in a turbofan's compressor?",
        answers: [
            "It is cooled below outside temperature",
            "It is directed into the cabin",
            "Its pressure increases",
            "It is turned into liquid fuel"
        ],
        correct: 2
    },

    {
        question: "What happens in a gas-turbine engine's combustion chamber?",
        answers: [
            "Air is vented into the cabin",
            "Fuel burns with compressed air and releases energy",
            "The landing gear is hydraulically retracted",
            "The fan blades are stopped"
        ],
        correct: 1
    },

    {
        question: "What does the turbine do in a turbofan engine?",
        answers: [
            "Stores fuel for cruise",
            "Measures aircraft altitude",
            "Controls the rudder directly",
            "Extracts energy from hot gases to drive rotating components"
        ],
        correct: 3
    },

    {
        question: "What does a flight-control actuator do?",
        answers: [
            "Moves a control surface in response to a command",
            "Records passenger announcements",
            "Measures runway length",
            "Produces electrical power from fuel"
        ],
        correct: 0
    },

    {
        question: "What is the purpose of leading-edge slats?",
        answers: [
            "Reduce the aircraft's cabin pressure",
            "Control the nose-wheel steering",
            "Help the wing produce lift at lower speeds",
            "Increase engine oil pressure"
        ],
        correct: 2
    },

    {
        question: "Why is an airliner's cabin pressurized during cruise?",
        answers: [
            "To increase the aircraft's lift",
            "To maintain a safe, comfortable cabin pressure at altitude",
            "To make the engines burn less fuel directly",
            "To cool the landing gear"
        ],
        correct: 1
    },

    {
        question: "What does an anti-skid braking system help prevent?",
        answers: [
            "The wings generating lift",
            "The engines producing thrust",
            "The cabin losing all ventilation",
            "The wheels locking during braking"
        ],
        correct: 3
    },

    {
        question: "What does the horizontal stabilizer help provide?",
        answers: [
            "Pitch stability",
            "Engine compression",
            "Fuel pressurization",
            "Directional stability only"
        ],
        correct: 0
    },

    {
        question: "What do hydraulic systems commonly provide on aircraft?",
        answers: [
            "Cabin lighting from sunlight",
            "Airflow through the engine bypass duct",
            "Force to operate high-load systems such as flight controls",
            "Navigation data from satellites"
        ],
        correct: 2
    }

];

let currentQuizQuestion = 0;
let quizScore = 0;
let quizAnswered = false;

function loadQuizQuestion() {

    const question = quizQuestions[currentQuizQuestion];

    document.getElementById("quizQuestionNumber").textContent =
        `QUESTION ${String(currentQuizQuestion + 1).padStart(2, "0")} / ${quizQuestions.length}`;

    document.getElementById("quizQuestion").textContent =
        question.question;

    const buttons =
        document.querySelectorAll(".quiz-options button");

    buttons.forEach((button, index) => {

        button.textContent = question.answers[index];

        button.disabled = false;

    });

    document.getElementById("quizFeedback").textContent = "";

    document.getElementById("quizNext").disabled = true;

    quizAnswered = false;
}


function selectAnswer(answerIndex) {

    if (quizAnswered) return;

    quizAnswered = true;

    const question = quizQuestions[currentQuizQuestion];

    const buttons =
        document.querySelectorAll(".quiz-options button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (answerIndex === question.correct) {

        quizScore++;

        document.getElementById("quizFeedback").textContent =
            "Correct. Excellent work.";

    } else {

        document.getElementById("quizFeedback").textContent =
            `Not quite. The correct answer is: ${question.answers[question.correct]}`;

    }

    document.getElementById("quizNext").disabled = false;
}


function nextQuizQuestion() {

    currentQuizQuestion++;

    if (currentQuizQuestion >= quizQuestions.length) {

        showQuizResult();

        return;
    }

    loadQuizQuestion();
}


function showQuizResult() {

    const card = document.querySelector(".quiz-card");

    card.innerHTML = `

        <div class="quiz-result">

            <span class="tag">MISSION COMPLETE</span>

            <h3>Aircraft Systems Assessment</h3>

            <p class="quiz-score">
                ${quizScore} / ${quizQuestions.length}
            </p>

            <p>
                You completed the SAEL Aerospace Lab
                aircraft systems knowledge check.
            </p>

            <button
                class="quiz-next"
                onclick="restartQuiz()">
                RETAKE QUIZ
            </button>

        </div>

    `;
}


function restartQuiz() {

    currentQuizQuestion = 0;
    quizScore = 0;
    quizAnswered = false;

    location.reload();

}
let exploredSystems = new Set();

function trackSystem(index) {

    exploredSystems.add(index);

    const count = exploredSystems.size;

    const progressBar =
        document.getElementById("progressBar");

    const progressText =
        document.getElementById("progressText");

    if (!progressBar || !progressText) return;

    progressText.textContent =
        `${count} / 5 SYSTEMS EXPLORED`;

    progressBar.style.width =
        `${(count / 5) * 100}%`;

    if (count === 5) {

        progressText.textContent =
            "5 / 5 SYSTEMS COMPLETE";

    }
}

if (window.location.hash === "#aircraft") {
    enterAircraftLab();
}

const creatorSection = document.querySelector("[data-reveal]");

if (creatorSection && "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    creatorSection.classList.add("reveal-pending");

    const creatorRevealObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
            creatorSection.classList.remove("reveal-pending");
            creatorSection.classList.add("is-revealed");
            creatorRevealObserver.disconnect();
        }
    }, { threshold: 0.18 });

    creatorRevealObserver.observe(creatorSection);
} else if (creatorSection) {
    creatorSection.classList.add("is-revealed");
}
