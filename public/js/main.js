$(document).ready(function(){
    var particles = Particles.init({
        maxParticles: 50,
        selector: '.background',
        color: ['#005792', '#c5e5e3'],
        connectParticles: true,
        responsive: [
            {
              breakpoint: 768,
              options: {
                maxParticles: 0
                }
            }
        ]
    });

});