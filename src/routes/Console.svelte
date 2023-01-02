<script>
    import { onMount } from 'svelte';
    // 참고 :
    // https://codepen.io/stathisg/pen/nayyyy
	let captionLength = 0;
    let caption = '';
    let blinkOpacity = 10;
    let minus = 1;
const onKeyDown = (e) => {
    console.log(e)
}


onMount(() => {
    
    // const blinking = setInterval(() => {
    //     if(blinkOpacity === 10) {
    //         minus = 1
    //     } else if(blinkOpacity === 0){
    //         minus = -1
    //     }
        
    //     blinkOpacity -= minus;
    // }, 30);

    return() => {
        // clearInterval(blinking);
    }
});

</script>

<style>
.consoleDiv {
    background-color: #000;
    padding: 1%;
    color: #ccc;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 1em;
    height: 800px;
}

.console {
    font-family: "Lucida Sans Typewriter", "Lucida Console", Monaco, "Bitstream Vera Sans Mono", monospace;
}

.consoleInput {
    border: 1px solid black !important;
}

.consoleInput:focus {
    outline: none;
    border: 1px solid black !important;
}
</style>

<div class="consoleDiv" on:click={()=> {}}>
    <div>
        
    </div>
    <p class="console">
        <span>DARAM x BUMGO:\</span>
        <input type="text" class="consoleInput" value={caption} on:keydown={onKeyDown}>
    </p>
</div>




