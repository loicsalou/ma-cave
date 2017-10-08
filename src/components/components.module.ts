import { NgModule } from '@angular/core';
import { RatingComponent } from './rating/rating';
import { BottleNotingComponent } from './bottle-noting/bottle-noting';
@NgModule({
	declarations: [RatingComponent,
    BottleNotingComponent],
	imports: [],
	exports: [RatingComponent,
    BottleNotingComponent]
})
export class ComponentsModule {}
