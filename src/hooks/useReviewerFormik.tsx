import { useFormik } from "formik";
import dayjs from "dayjs";
import * as Yup from "yup";

export default function useReviewerFormik(process, onSubmitCallback) {
    
    const formik = useFormik({
    initialValues: {
      reviewer: process?.reviewer_id || "",
      reviewerName: process?.reviewer_fullname || "",
      reviewerDesignationLetterSubmitted: process?.reviewer_letter || false,
      reviewerApprovalLetterSubmitted: process?.reviewer_approval || false,
      date_reviewer_assignament: process?.date_reviewer_assignament
        ? dayjs(process.date_reviewer_assignament)
        : null,
    },
    validationSchema: Yup.object({
    reviewer: Yup.string().required("Selecciona un revisor"),
    date_reviewer_assignament: Yup.mixed().required("Selecciona una fecha"),
    }),
    onSubmit: onSubmitCallback,
    enableReinitialize: true,
});

    const canApproveStage = () => {
    return (
        !!formik.values.reviewer &&
        !!formik.values.date_reviewer_assignament &&
        formik.values.reviewerDesignationLetterSubmitted &&
        formik.values.reviewerApprovalLetterSubmitted
    );
    };

return { formik, canApproveStage };
}