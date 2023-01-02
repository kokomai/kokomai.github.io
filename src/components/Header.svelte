<script>
    import { link } from 'svelte-spa-router'
    
    let isBurgerActive = false;
    let navItems = [
        { label: "Home", href: "/", active: true },
        { label: "About", href: "/about", active: false },
        // { label: "Console", href: "/console", active: false }
    ]
    
    function checkNowPage() {
        let nowPath = window.location.hash;
        
        if(nowPath !== "") {
            for(let item of navItems) {
                if(item.href === nowPath.replace("#", "")) {
                    item["active"] = true;
                } else {
                    item["active"] = false;
                }
            }
        }
        navItems = navItems;
    }

    checkNowPage();
</script>
  
<nav class="navbar is-white is-fixed-top">
    <div class="container">
        <div class="navbar-brand">
            <div class="navbar-item">
                <div class="has-background-grey">
                    <a class="brand-text has-text-white m-3" use:link href="/">
                    CODING ORCA
                    </a>
                </div>
            </div>
            <div class="navbar-burger burger"
                class:is-active={isBurgerActive} 
                on:click={()=>{isBurgerActive = !isBurgerActive}}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div id="navMenu" class="navbar-menu" class:is-active={isBurgerActive}>
            <div class="navbar-start">
                {#each navItems as item}
                    <a 
                    class="navbar-item" 
                    class:is-active={item.active} 
                    use:link href={item.href}
                    on:click={()=>{ checkNowPage() }}
                    >
                        {item.label}
                    </a>
                {/each}
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