import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';



@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit, OnDestroy {
  loadedRecipe: Recipe;

  constructor(
      private activatedRoute: ActivatedRoute,
      private recipesService: RecipesService,
      private router: Router,
      private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // this.activatedRoute.paramMap.subscribe(paramMap => {
    //   if (!paramMap.has('recipeId')) {
    //     // redirect
    //     return;
    //   }
    //   const recipeId = paramMap.get('recipeId');
    //   this.loadedRecipe = this.recipesService.getRecipe(recipeId);
    // });
    console.log('detail ngOnInit');
    const recipeId = this.activatedRoute.snapshot.paramMap.get('recipeId');
    this.loadedRecipe = this.recipesService.getRecipe(recipeId);
  }

  ionViewWillEnter() {
    console.log('detail ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('detail ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('detail ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('detail ionViewDidLeave');
  }

  ngOnDestroy() {
    console.log('detail ngOnDestroy');
  }

  onDeleteRecipe() {
    this.alertCtrl
        .create({
          header: 'Are you sure?',
          message: 'Do you really want to delete the recipe?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Delete',
              handler: () => {
                this.recipesService.deleteRecipe(this.loadedRecipe.id);
                this.router.navigate(['/recipes']);
              }
            }
          ]
        })
        .then(alertEl => {
          alertEl.present();
        });
  }

}
