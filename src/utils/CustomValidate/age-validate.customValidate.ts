import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class CheckUserAgeConstraint implements ValidatorConstraintInterface {
    validate(val: any, args: ValidationArguments) {
        return (new Date().getTime() - Number(new Date(val))) / (24 * 3600 * 365.25 * 1000) >= 14;
    }
}

export function CheckUserAge(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: CheckUserAgeConstraint,
        });
    };
}