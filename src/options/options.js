// import optionsStore from './reducers';
// import showMessage from './showmessage';

// const redirectUrlInput = document.getElementById('redirect-url');
// const filterUrlInput = document.getElementById('filter-url');
// const optionsTable = document.getElementById('options-table');
// const formIndex = document.getElementById('opt-index');
// const addEntryBtn = document.getElementById('add-entry-btn');

// function render() {

//     const state = optionsStore.getState();
//     const options = state.options || [];
//     const formState = state.formState || {};

//     // update options table
//     optionsTable.innerHTML = options.map((opt, i) => {
//         return `
//         <div>${opt.filterUrl}</div>
//         <div>${opt.redirectUrl}</div>
//         <div data-index="${i}">
//             <a href='#' data-type="edit">edit</a> |
//             <a href='#' data-type="delete">delete</a>
//         </div>`
//     }).join('');

//     // update form
//     formIndex.value = options.length + 1;
//     filterUrlInput.value = formState.filterUrl || "";
//     redirectUrlInput.value = formState.redirectUrl || "";

// }

// render();

// optionsStore.subscribe(render);

// // need to delete
// const logCurrentState = () => console.log(optionsStore.getState());
// optionsStore.subscribe(logCurrentState);

// // event handlers
// addEntryBtn.addEventListener('click', function (e) {

//     optionsStore.dispatch({
//         type: "ADD_OPTION",
//         option: {
//             filterUrl: filterUrlInput.value,
//             redirectUrl: redirectUrlInput.value
//         }
//     });
//     showMessage('entry added.');
    
//     optionsStore.dispatch({
//         type: "RESET_FORM"
//     })
    
// });

// optionsTable.addEventListener('click', function (e) {
//     e.preventDefault();
//     const storeState = optionsStore.getState();
//     if (e.target.dataset.type === 'edit') {
//         const editOption = storeState.filter((o, i) => i === e.target.parentElement.dataset.index);
//         optionsStore.dispatch({
//             type: "UPDATE_FORM",
//             data: {
//                 index: e.target.parentElement.dataset.index,
//                 filterUrl: editOption.filterUrl,
//                 redirectUrl: editOption.redirectUrl
//             }
//         });
//     }

//     if (e.target.dataset.type === 'delete') {
//         optionsStore.dispatch({
//             type: "DELETE_OPTION",
//             index: e.target.parentElement.dataset.index
//         });
//         showMessage('Deleted succesfully.');
//     }
// })