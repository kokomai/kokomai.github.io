import Home from './Home.svelte'
import About from './About.svelte'
import Console from './Console.svelte'
import Error404 from './404.svelte'

export default {
  '/': Home,
  '/about': About,
  '/console' : Console,
  "*": Error404
}