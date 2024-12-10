import { z } from 'zod';

export const organizationSchema = z.object({
    company_name: z.string().optional(),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phone: z
        .string()
        .regex(/^\d+$/, { message: "Số điện thoại phải là số" })
        .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" }),
    username: z.string().min(1, { message: "Họ và Tên là bắt buộc" }),
    table_count: z
        .coerce.number()
        .int({ message: "Số lượng bàn chính phải là số nguyên" })
        .min(1, { message: "Số lượng bàn chính phải lớn hơn 0" }),
spare_table_count: z
        .coerce.number()
        .int({ message: "Số bàn dự phòng phải là số nguyên" })
        .min(0, { message: "Số bàn dự phòng không được nhỏ hơn 0" }) 
        .optional(), 
    customer: z
        .preprocess(val => parseInt(val, 10), z.number().int({ message: "Số lượng khách phải là số nguyên" }).positive({ message: "Số lượng khách phải lớn hơn 0" })),
    customerAndChair: z
        .number()
        .default(10),
    partyDate: z.string().nonempty({ message: "Ngày đặt tiệc là bắt buộc" }),
    organization_date: z.string().nonempty({ message: "Ngày tổ chức là bắt buộc" }),
    shift: z.string().nonempty({ message: "Ca hoạt động là bắt buộc" }),
    total_amount: z
        .preprocess(val => parseInt(val, 10), z.number().int({ message: "Số lượng khách phải là số nguyên" })),
    depositAmount: z
        .preprocess(val => parseInt(val, 10), z.number().int({ message: "Số lượng khách phải là số nguyên" })),
    // amount_booking: z
    //     .preprocess(val => parseInt(val, 10), z.number().int({ message: "Số lượng khách phải là số nguyên" }).positive({ message: "Số lượng khách phải lớn hơn 0" })),
    depositDate: z.string().optional(),
    dataPay: z.string().optional(),
});