export default class UserDto {
    email;
    id;
    isActivated;
    username;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.username = model.username;
    }

}