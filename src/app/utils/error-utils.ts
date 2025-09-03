import { HttpErrorResponse } from "@angular/common/http";

export function validationSuffix(error: HttpErrorResponse): string {
    if (error?.error?.error === 'ValidationError')
        return " - " + error.error.message;
    else
        return "";
}