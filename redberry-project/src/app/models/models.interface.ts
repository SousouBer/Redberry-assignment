export interface CategoryData {
  data: Category[];
}

export interface Category {
  id: number;
  title: string;
  text_color: string;
  background_color: string;
}

export interface BlogsData {
  data: Blog[];
}

export interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  publish_date: string;
  categories: Category[];
  author: string;
}