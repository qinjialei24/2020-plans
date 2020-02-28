declare class CreatePostDto {
    title: string;
    content: string;
}
export declare class PostsController {
    index(): void;
    create(body: CreatePostDto): CreatePostDto;
    detail(id: string, body: CreatePostDto): {
        success: boolean;
    };
    remove(id: string): {
        success: boolean;
    };
}
export {};
