import { IconLayer, make_subroute_nav_links } from "$navigation/nav-functions";
import { faCalculator, faComputerMouse, faGifts, faKeyboard, faReceipt, faTools } from "@fortawesome/free-solid-svg-icons";
import type { LayoutLoadEvent } from "./$types";

export async function load({ url }: LayoutLoadEvent) {
    
    const icon_map = new Map([
        ['buttons', new IconLayer({icon: faComputerMouse})],
        ['functions', new IconLayer({icon: faCalculator})],
        ['inputs', new IconLayer({icon: faKeyboard})],
        ['recipes', new IconLayer({icon: faReceipt})],
        ['tooltips', new IconLayer({icon: faTools})],
        ['wrappers', new IconLayer({icon: faGifts})],
    ])
    const nav_links = await make_subroute_nav_links(import.meta.url, url, icon_map)
    
    return {
        nav_links
    }
	
}