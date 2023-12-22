type UserData = {
    _id: string;
    email: string;
    name: string;
    image: string;
    password: string;
    status: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
    socketId: string;
    __v: number;
};

type Errors = {
    location: string;
    msg: string;
    path: string;
    type: string;
    value: string;
};

type Message = {
    _id: string;
    content: string;
    fromSelf: boolean;
    from: string;
    to: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};
