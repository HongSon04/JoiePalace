export const FormatReturnData = (datas: any, moreOptions: string[]) => {
  const FormatedArray = [];
  const fieldsToRemove = [
    'deleted',
    'deleted_at',
    'deleted_by',
    'created_by',
    'updated_by',
    ...moreOptions,
  ];

  // ? Nếu data là 1 mảng thì làm dưới đây không thì else
  if (Array.isArray(datas)) {
    datas.forEach((data: any) => {
      const FormatedData = { ...data };
      fieldsToRemove.forEach((field) => {
        delete FormatedData[field];
      });
      FormatedArray.push(FormatedData);
    });
  } else {
    const FormatedData = { ...datas };
    fieldsToRemove.forEach((field) => {
      delete FormatedData[field];
    });
    FormatedArray.push(FormatedData);
  }

  return FormatedArray;
};
