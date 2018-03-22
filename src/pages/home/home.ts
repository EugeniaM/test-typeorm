import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { getRepository, Repository } from 'typeorm';
import { SQLite, SQLiteObject} from '@ionic-native/sqlite';

import { Author } from '../../entities/author';
import { Category } from '../../entities/category';
import { Post } from '../../entities/post';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private savedPost: boolean = false;
  private loadedPost: Post[] = [];

  constructor(
    public navCtrl: NavController,
    private sqlite: SQLite
  ) { }

  ionViewDidLoad() {
    this.runDemo();
  }

  async runDemo() {
    const category1 = new Category();
    category1.name = "TypeScript";

    const category2 = new Category();
    category2.name = "Programming";

    const author = new Author();
    author.name = "Person";

    const post = new Post();
    post.Title = "TestTestTest";
    post.text = `TestTestTest))))))))`;
    post.categories = [category1, category2];
    post.author = author;

    const postRepository = getRepository('post') as Repository<Post>;
    await postRepository.save(post);

    console.log("Post has been saved");
    this.savedPost = true;

    const loadedPost = await postRepository.createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'author')
      .innerJoinAndSelect('post.categories', 'categories')
      // .where('post.id = :id', {id: post.id})
      .getMany();
      // .getOne();

    console.log("Post has been loaded: ", loadedPost);
    this.loadedPost = loadedPost;
  }

  async runSQL() {
    this.sqlite.create({
      name: 'test',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM post', {})
        .then(res => {
          this.savedPost = true;

          for (let i = 0; i < res.rows.length; i++) {
            console.log('!!!!!!!!!!!!!!!!!', res.rows.item(i));
          }
        }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  // getCategories() {
  //   if(this.loadedPost) {
  //     return this.loadedPost.categories.map(cat => cat.name).join(", ");
  //   }
  //
  //   return '';
  // }

}
