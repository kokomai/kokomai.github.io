export enum Page {
  PAGE1 = 'page1',
  PAGE2 = 'page2',
  PAGE3 = 'page3',
  PAGE4 = 'page4',
  PAGE5 = 'page5',
  PAGE6 = 'page6'
}

export interface WeddingState {
  currentPage: Page;
  isTransitioning: boolean;
  characterPosition: number;
  currentBuilding: number;
}
