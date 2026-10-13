import type { CreatePaymentMethodDTO, DebitCardDTO, PaginatedPaymentMethodsResponse, PaginationDTO, PaymentMethodDTO } from "../Models/dto";
import { apiRequest, jsonBody, paginationQuery } from "./apiRequest";

export async function getPaymentMethods(
    pagination: PaginationDTO,
): Promise<PaginatedPaymentMethodsResponse> {
    return apiRequest<PaginatedPaymentMethodsResponse>(
        `/payment-methods/${paginationQuery(pagination)}`,
        { method: "GET" },
    );
}

export async function getPaymentMethod(
    paymentMethodId: number,
): Promise<PaymentMethodDTO> {
    return apiRequest<PaymentMethodDTO>(
        `/payment-methods/${paymentMethodId}/`,
        { method: "GET" },
    );
}

export async function createPaymentMethod(
    paymentMethod: CreatePaymentMethodDTO,
): Promise<PaymentMethodDTO> {
    return apiRequest<PaymentMethodDTO>("/payment-methods/create/", {
        method: "POST",
        ...jsonBody(paymentMethod),
    });
}

export async function getMyPaymentMethods(): Promise<PaymentMethodDTO[]> {
    return apiRequest<PaymentMethodDTO[]>("/user/payment-methods/", {
        method: "GET",
    });
}

export async function updatePaymentMethod(
    paymentMethodId: number,
    paymentMethod: Partial<CreatePaymentMethodDTO>,
): Promise<PaymentMethodDTO> {
    return apiRequest<PaymentMethodDTO>(
        `/payment-methods/${paymentMethodId}/update/`,
        { method: "PUT", ...jsonBody(paymentMethod) },
    );
}

export async function deletePaymentMethod(
    paymentMethodId: number,
): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
        `/payment-methods/${paymentMethodId}/delete/`,
        { method: "DELETE" },
    );
}

export async function setDefaultPaymentMethod(
    paymentMethodId: number,
): Promise<{ payMethod: number }> {
    return apiRequest<{ payMethod: number }>(
        `/payment-methods/${paymentMethodId}/default/`,
        { method: "POST" },
    );
}

export async function getDebitCards(): Promise<DebitCardDTO[]> {
    return apiRequest<DebitCardDTO[]>("/debit-cards/");
}