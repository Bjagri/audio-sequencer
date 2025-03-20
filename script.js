document.addEventListener("DOMContentLoaded", async () => {
    const playButton = document.getElementById("play");
    const stopButton = document.getElementById("stop");
    const sequencer = document.getElementById("sequencer");
    const audioFileInput = document.getElementById("audioFile");

    const steps = 8;  // Number of beats
    let pattern = new Array(steps).fill(false);

    // Create beat sequencer buttons
    for (let i = 0; i < steps; i++) {
        let step = document.createElement("div");
        step.classList.add("step");
        step.dataset.index = i;
        step.addEventListener("click", () => {
            pattern[i] = !pattern[i];
            step.classList.toggle("active");
        });
        sequencer.appendChild(step);
    }

    // Tone.js synth
    const synth = new Tone.Synth().toDestination();
    const loop = new Tone.Sequence((time, stepIndex) => {
        if (pattern[stepIndex]) {
            synth.triggerAttackRelease("C4", "8n", time);
        }
    }, [...Array(steps).keys()], "8n");

    playButton.addEventListener("click", async () => {
        await Tone.start();
        loop.start(0);
        Tone.Transport.start();
    });

    stopButton.addEventListener("click", () => {
        Tone.Transport.stop();
        loop.stop();
    });

    // Wavesurfer.js for audio editing
    let wavesurfer = WaveSurfer.create({
        container: "#waveform",
        waveColor: "violet",
        progressColor: "purple",
    });

    audioFileInput.addEventListener("change", (event) => {
        let file = event.target.files[0];
        if (file) {
            let url = URL.createObjectURL(file);
            wavesurfer.load(url);
        }
    });
});
