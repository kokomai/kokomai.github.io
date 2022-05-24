<script>
    import { link } from 'svelte-spa-router'
    
    let isActive = false;

</script>
  
<nav class="navbar is-white is-fixed-top">
    <div class="container">
        <div class="navbar-brand">
            <div class="navbar-item">
                <div class="has-background-grey">
                    <a class="brand-text has-text-white m-3" use:link href="/">
                    Coding Orca's Cave
                    </a>
                </div>
            </div>
            <div class="navbar-burger burger"
                class:is-active={isActive} 
                on:click={()=>{isActive = !isActive}}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div id="navMenu" class="navbar-menu" class:is-active={isActive}>
            <div class="navbar-start">
                <a class="navbar-item" use:link href="/">Home</a>
                <a class="navbar-item" use:link href="/about">About</a>
            </div>
        </div>
    </div>
</nav>
<hr>
<section class="hero is-medium ml-4 mr-4 mb-3">
    <figure class="image is-3by1">
        <img src="/images/swimmingOrca1.gif" alt="banner"/>
    </figure>
</section>