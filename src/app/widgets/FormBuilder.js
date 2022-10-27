// import React from "react";
// import FormBuilder from 'th-react-formbuilder1'
// // import Form from "../components/Form";
// // import Button from "../components/Button";

// export default function FormBuilderComp(){
 
// var items = [{
//   key: 'Header',
//   name: 'Header Text',
//   icon: 'fa fa-header',
//   static: true,
//   content: 'Placeholder Text...'
// },
// {
//   key: 'Paragraph',
//   name: 'Paragraph',
//   static: true,
//   icon: 'fa fa-paragraph',
//   content: 'Placeholder Text...'
// }];
 
// const existingItems =()=> {
//   console.log('onLoad');
//   return new Promise((resolve, reject) => {
//     return resolve([
//       {
//         allowDelete: false,
//         "id": "DEA93ED6-54AE-4F4F-A785-E76F75C11006",
//         "element": "FileInput",
//         "text": "FileInput",
//         "required": false,
//         "fieldName": "file_2DFCB94D-A736-4CD2-89E9-42CFD9A51A75",
//         "label": "Placeholder Label"
//       },
//     ]);
//   });
// };
 
// // function to get field list data from form builder
// function getData(e) {
//   this.setState({ fieldsList: e });
// }
 
// // function to get field list data from form builder database
// function getList(fieldsList) {
//   return new Promise((resolve, reject) => {
//     return resolve(this.state.fieldsList)
//   });
// };
// const answerData = {
//   "text_input_DEA657C9-4404-4A16-A935-9D9E4E235D6E" : "Test Value",
//   "text_input_DEA657C9-2345-4A16-A935-9D9E4E235D6E" : "Another Test Value",
// };

// return(<>
// <FormBuilder.ReactFormBuilder
//   url='path/to/GET/initial.json'
//   toolbarItems={items}
//   onLoad={existingItems ||  getList(this.state.fieldsList)}
//   onPost={(e) => getData(e)}
//   saveUrl='path/to/POST/built/form.json' />

// <FormBuilder.ReactFormGenerator
//     form_action="/path/to/form/submit"
//     form_method="POST"
//     onSubmit={onsubmit}
//     task_id={12} // Used to submit a hidden variable with the id to the form from the database.
//     answer_data={answerData} // Answer data, only used if loading a pre-existing form with values.
//   />
//   </>
//  );
// }