let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");

let readLine = require("readline");

const { PRIORITY_ABOVE_NORMAL } = require("constants");
let reader = readLine.createInterface({
    input: process.stdin,
    output: process.stdout}
);

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("C://Users/alejo/Downloads/gRPC-master/proto/vacaciones.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true}
    )
);

const REMOTE_URL= "0.0.0.0:50050";

let client = new proto.work_leave.EmployeeLeaveDaysService(REMOTE_URL,grpc.credentials.createInsecure());

reader.question("Ingrese su id: ", answer => {
    employee_id = answer
    reader.question("Ingrese nombre: ", answer => {
        name = answer
        reader.question("Ingrese la cantidad de días de licencia acumulados: ", answer => {
            accrued_leave_days = answer
            reader.question("Ingrese la cantidaad de días de licencia requeridos: ", answer => {
                requested_leave_days = answer
                client.eligibleForLeave({accrued_leave_days: accrued_leave_days, requested_leave_days: requested_leave_days}, 
                    (err, res) => {
                        estado = res.eligible;
                        if(estado==true){
                            client.grantLeave({accrued_leave_days: accrued_leave_days, requested_leave_days: requested_leave_days},
                                (err, res) => {
                                    console.log(`granted: ${res.granted}, accrued_leave_days: ${res.accrued_leave_days}, granted_leave_days: ${res.granted_leave_days}`);
                            })
                        }else{
                            client.grantLeave({accrued_leave_days: accrued_leave_days, requested_leave_days: requested_leave_days},
                                (err, res) => {
                                    console.log(`granted: ${estado}, accrued_leave_days: 0, granted_leave_days: ${res.granted_leave_days}`);
                            })
                        }
                });
            });
        });
    });
});


