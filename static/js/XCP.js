$('#CMD-data-table').bootstrapTable({
    columns: [
        {
            field: 'Command',
            title: 'Command',
            class:'Command-class',
            sortable: true,
        },{
            field: 'Code',
            title: 'Code',
            class:'Code-class',
            sortable: true,
        },{
            field: 'IsOptional',
            title: 'IsOptional',
            class:'IsOptional-class',
            sortable: true,
        },{
            field: 'Type',
            title: 'Type',
            class:'Type-class',
            sortable: true,
        }
    ],
    sortName: 'Code',
    search: true,
    // showColumns:true,

});

$('#ERROR-data-table').bootstrapTable({
    columns: [
        {
            field: 'Error',
            title: 'Error',
            class:'Error-class',
            sortable: true,
        },{
            field: 'Code',
            title: 'Code',
            class:'Code-class',
            sortable: true,
        },{
            field: 'Description',
            title: 'Description',
            class:'Description-class',
            sortable: true,
        },{
            field: 'Severity',
            title: 'Severity',
            class:'Severity-class',
            sortable: true,
        }
    ],
    sortName: 'Code',
    search: true,
    // showColumns:true,

});

$('#EVENT-data-table').bootstrapTable({
    columns: [
        {
            field: 'Event',
            title: 'Event',
            class:'Event-class',
            sortable: true,
        },{
            field: 'Code',
            title: 'Code',
            class:'Code-class',
            sortable: true,
        },{
            field: 'Description',
            title: 'Description',
            class:'Description-class',
            sortable: true,
        },{
            field: 'Severity',
            title: 'Severity',
            class:'Severity-class',
            sortable: true,
        }
    ],
    sortName: 'Code',
    search: true,
    // showColumns:true,

});


function loadData(){
    $.ajax({
        url: "static/data/XCP.json",
        type: "GET",
        data: "",
        success: function (result) {
            var COMMAND_data = [];
            $.each(result["COMMAND CODES"],function(index,value){
                COMMAND_data.push({"Command":value["Command"],"Code": value["Code"],"IsOptional":value["IsOptional"],"Type":value["Type"]});
            });
            $('#CMD-data-table').bootstrapTable("load",COMMAND_data);

            var ERROR_data = [];
            $.each(result["ERROR CODES"],function(index,value){
                ERROR_data.push({"Error":value["Error"],"Code": value["Code"],"Description":value["Description"],"Severity":value["Severity"]});
            });

            $('#ERROR-data-table').bootstrapTable("load",ERROR_data);

            var EVENT_data = [];
            $.each(result["EVENT CODES"],function(index,value){
                EVENT_data.push({"Event":value["Event"],"Code": value["Code"],"Description":value["Description"],"Severity":value["Severity"]});
            });

            $('#EVENT-data-table').bootstrapTable("load",EVENT_data);

            $(".bootstrap-table").show();
        }
    });
}

$("#btn-search").click(function () {
    loadData();
})

loadData();
