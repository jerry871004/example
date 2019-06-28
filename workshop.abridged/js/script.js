var bookDataFromLocalStorage = [];
var flag = true;
var max_num = 0;


$(function(){
    loadBookData();
    var data = [
        {text:"資料庫",value:"image/database.jpg"},
        {text:"網際網路",value:"image/internet.jpg"},
        {text:"應用系統整合",value:"image/system.jpg"},
        {text:"家庭保健",value:"image/home.jpg"},
        {text:"語言",value:"image/language.jpg"},
        {text:"行銷",value:"image/sale.jpg"},
        {text:"管理",value:"image/management.jpg"}
    ]
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChange
    });
    $("#bought_datepicker").kendoDatePicker();
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type:"int"},
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookPublisher: { type: "string" },
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input id='book-search' class='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 650,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號",width:"7%"},
            { field: "BookName", title: "書籍名稱", width: "34%" },
            { field: "BookCategory", title: "書籍種類", width: "11%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookPublisher", title: "出版社", width: "18%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]   
    });

//----------------------------validator---------------------------------------------------------------
    validator = $("#window").kendoValidator().data("kendoValidator");
    
//----------------------------validator---------------------------------------------------------------
    for(var i=0;i<bookDataFromLocalStorage.length;i++){
        if(bookDataFromLocalStorage[i].BookId>max_num){
            max_num = bookDataFromLocalStorage[i].BookId;
        }
    }
//----------------------------book search---------------------------------------------------------------
    $('#book-search').keyup(function(){
            var searchName = $('#book-search').val();
            console.log(searchName);
            $("#book_grid").data('kendoGrid').dataSource.filter({
                    logic : 'and',
                    filters: [{ 
                        field: "BookName", 
                        operator: "contains", 
                        value: $('#book-search').val() 
                    }]
                    // filters: [{ 
                    //     field: "BookId", 
                    //     operator: "contains", 
                    //     value: $('#book-search').val() 
                    // }],
                    // filters: [{ 
                    //     field: "BookCategory", 
                    //     operator: "contains", 
                    //     value: $('#book-search').val() 
                    // }],
                    // filters: [{ 
                    //     field: "BookPublisher", 
                    //     operator: "contains", 
                    //     value: $('#book-search').val() 
                    // }]
            });
    });
//----------------------------book search---------------------------------------------------------------
//----------------------------add book------------------------------------------------------------------
    $('#add-book').click(function(){
        if(validator.validate()){
            max_num =max_num+1;
            var category = $('#book_category').data("kendoDropDownList").text();
            var name  = $('#book_name').val();
            var author = $('#book_author').val();
            var publisher = $("#book_publisher").val();
            var date =  kendo.toString(new Date($('#bought_datepicker').val()),"yyyy-MM-dd");
            console.log(category);
            console.log(name);
            console.log(author);
            console.log(publisher);
            console.log(date);
            bookDataFromLocalStorage.push({
                                            "BookAuthor":author,
                                            "BookBoughtDate":date,
                                            "BookCategory":category,
                                            "BookId":max_num,
                                            "BookName":name ,
                                            "BookPublisher":publisher  
                                         });
            // bookDataFromLocalStorage.slice(max_num,0,max_num,category,name,author,date);
            localStorage['bookData'] = JSON.stringify(bookDataFromLocalStorage);
            $("#book_grid").data("kendoGrid").dataSource.data(bookDataFromLocalStorage);
        }
    })

//------------------------add book end-----------------------------------------------------------------
})

function loadBookData(){
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
    }
}
function onChange(){
    $(".book-image").attr("src",$("#book_category").val())
} 
//----------------------------delete book fun----------------------------------------------------------
function deleteBook(a){
    var id = this.dataItem($(a.currentTarget).closest("tr")).BookId
    for(var i =0; i<bookDataFromLocalStorage.length; i++ ){
                if (bookDataFromLocalStorage[i].BookId==id) {
                    bookDataFromLocalStorage.splice(i,1)
                    break;
                }
    }
    localStorage['bookData'] = JSON.stringify(bookDataFromLocalStorage);
    $("#book_grid").data("kendoGrid").dataSource.data(bookDataFromLocalStorage);
}
//----------------------------delete book fun----------------------------------------------------------