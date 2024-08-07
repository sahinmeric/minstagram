interface Comment {
  userName: string;
  userId: string;
  comment: string;
  createdAt: any;
}

interface Photo {
  id: string;
  url: string;
  description: string;
  createdAt: any;
  userName: string;
  likes: number;
  comments?: Comment[]; // Optional property to avoid undefined errors
}

export {};
