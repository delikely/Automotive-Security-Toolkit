$('#data-table').bootstrapTable({
    columns: [
        {
            field: 'DID',
            title: 'DID',
            class:'DID-class',
            sortable: true,
            visible: true,
        },{
            field: 'description',
            title: 'Description',
            class:'description-class',
            sortable: true,
            visible: false
        },{
            field: 'abbreviation',
            title: 'Abbreviation',
            class:'abbreviation-class',
            sortable: true,
            visible: true,
        },{
            
            field: 'mnemonic',
            title: 'Mnemonic',
            class:'mnemonic-class',
            sortable: true,
            visible: true,
        }
    ],
    // sortName: 'DID',
    pagination: false,
    showColumns:true,
    // showColumnsSearch:true,
    search: true,
});

function loadData(){
    $.ajax({
        url: "static/data/UDS_DID.json",
        type: "GET",
        data: "",
        success: function (result) {
            var data = [];
            $.each(result,function(index,value){
                data.push({"DID":value["DID"],"description": value["description"],"abbreviation":value["abbreviation"],"mnemonic":value["mnemonic"]});
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
