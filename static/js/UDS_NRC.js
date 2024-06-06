$('#data-table').bootstrapTable({
    columns: [
        {
            field: 'NRC',
            title: 'NRC',
            class:'NRC-class',
            sortable: true,
        },{
            field: 'description',
            title: 'Description',
            class:'description-class',
            sortable: true,
        },{
            field: 'abbreviation',
            title: 'Abbreviation',
            class:'abbreviation-class',
            sortable: true,
        }
    ],
    sortName: 'NRC',
    search: true,
    // showColumns:true,

});

function loadData(){
    $.ajax({
        url: "static/data/UDS_NRC.json",
        type: "GET",
        data: "",
        success: function (result) {
            var data = [];
            $.each(result,function(index,value){
                data.push({"NRC":value["NRC"],"description": value["description"],"abbreviation":value["abbreviation"]});
            });
            $('#data-table').bootstrapTable("load",data);
            $(".bootstrap-table").show();
        }
    });
}

$("#btn-search").click(function () {
    loadData();
})

loadData();
